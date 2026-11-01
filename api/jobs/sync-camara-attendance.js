import { db } from 'hatchable';

export const access='scheduler';
export const methods=['POST'];

const BASE='https://dadosabertos.camara.leg.br/api/v2';

async function getJson(url, attempts=4){
  let last;
  for(let i=0;i<attempts;i++){
    try{
      const r=await fetch(url,{headers:{accept:'application/json'}});
      if(r.ok) return await r.json();
      last=new Error('HTTP '+r.status);
      if(r.status<500 && r.status!==429) break;
    }catch(e){ last=e; }
    await new Promise(r=>setTimeout(r,500*(i+1)));
  }
  throw last||new Error('request failed');
}

async function collectAll(url){
  const out=[]; let page=1;
  while(true){
    const j=await getJson(url+(url.includes('?')?'&':'?')+'pagina='+page+'&itens=100');
    out.push(...(j.dados||[]));
    if(!(j.links||[]).some(x=>x.rel==='next')) break;
    if(++page>100) throw new Error('pagination guard exceeded');
  }
  return out;
}

function isAttendanceEvent(x){
  const t=String(x.descricaoTipo||'').toLowerCase();
  return t.includes('reunião deliberativa') ||
    t.includes('sessão deliberativa') ||
    t.includes('audiência pública e deliberação');
}

function activeOn(history,date){
  const rows=(history||[]).filter(x=>String(x.dataHora||'').slice(0,10)<=date)
    .sort((a,b)=>String(a.dataHora||'').localeCompare(String(b.dataHora||'')));
  if(!rows.length) return false;
  const latest=rows[rows.length-1];
  const status=String(latest.situacao||'').toUpperCase();
  return status==='EXERCÍCIO';
}

async function fetchHistory(id){
  const j=await getJson(BASE+'/deputados/'+encodeURIComponent(id)+'/historico');
  return j.dados||[];
}

export default async function(req,res){
  const year=Number(req.body?.year||new Date().getUTCFullYear());
  const start=req.body?.start||year+'-01-01';
  const end=req.body?.end||year+'-12-31';

  const period=(await db.query(
    "SELECT id FROM periods WHERE type='year' AND reference_year=$1 AND office='Deputados Federais' AND methodology_version='1.0' LIMIT 1",
    [year]
  )).rows[0];
  if(!period) return res.status(404).json({error:'period not found',year});

  const source=(await db.query(
    "SELECT id FROM sources WHERE institution='Câmara dos Deputados' LIMIT 1"
  )).rows[0]?.id||null;

  const [deputies,eventRows]=await Promise.all([
    db.query("SELECT id,official_id FROM politicians WHERE office='Deputados Federais'"),
    db.query("SELECT id,external_id FROM chamber_events WHERE period_id=$1",[period.id])
  ]);

  const deputyMap=new Map(deputies.rows.map(x=>[String(x.official_id),x.id]));
  const eventMap=new Map(eventRows.rows.map(x=>[String(x.external_id),x.id]));

  const events=(await collectAll(BASE+'/eventos?dataInicio='+start+'&dataFim='+end))
    .filter(isAttendanceEvent)
    .filter(x=>String(x.situacao||'').toLowerCase().includes('encerr'));

  const targetEvents=events.filter(x=>eventMap.has(String(x.id)));
  const histories=new Map();
  const failures=[];

  // Histórico é coletado em lotes para evitar sobrecarga da API.
  const ids=deputies.rows.map(x=>String(x.official_id));
  for(let i=0;i<ids.length;i+=25){
    const batch=ids.slice(i,i+25);
    const results=await Promise.all(batch.map(async id=>{
      try{return [id,await fetchHistory(id)];}
      catch(e){failures.push({deputy_id:id,stage:'history',error:String(e.message||e)});return [id,[]];}
    }));
    for(const [id,h] of results) histories.set(id,h);
  }

  const eligibility=[];
  const attendance=[];
  const updates=[];
  let plenaryEvents=0;

  for(const event of targetEvents){
    const eventDate=String(event.dataHoraInicio||'').slice(0,10);
    const orgs=Array.isArray(event.orgaos)?event.orgaos:[];
    const isPlenary=orgs.some(o=>String(o.sigla||'').toUpperCase()==='PLEN') ||
      String(event.descricaoTipo||'').toLowerCase().includes('sessão deliberativa');

    const eligible=new Set();

    if(isPlenary){
      plenaryEvents++;
      for(const d of deputies.rows){
        if(activeOn(histories.get(String(d.official_id)),eventDate)) eligible.add(d.id);
      }
    }else{
      const orgCache=[];
      for(const org of orgs){
        try{
          const members=await collectAll(BASE+'/orgaos/'+encodeURIComponent(org.id)+'/membros');
          for(const m of members){
            const pid=deputyMap.get(String(m.id));
            if(pid && activeOn(histories.get(String(m.id)),eventDate)) eligible.add(pid);
          }
        }catch(e){
          failures.push({event_id:event.id,stage:'members',error:String(e.message||e)});
        }
      }
    }

    const eventDbId=eventMap.get(String(event.id));
    if(!eventDbId) continue;

    const mode=isPlenary?'plenary_historical_roster':'committee_members_with_history';
    updates.push({
      id:eventDbId,event_type:event.descricaoTipo||null,status:event.situacao||null,
      description:event.descricao||null,eligibility_mode:mode,
      denominator_status:eligible.size?'validated_from_historical_exercise':'invalid'
    });

    for(const pid of eligible){
      eligibility.push({
        event_id:eventDbId,politician_id:pid,eligibility_state:'eligible',
        source_id:source,source_url:BASE+'/deputados/{id}/historico',reference_date:eventDate
      });
    }

    try{
      const attendees=await getJson(BASE+'/eventos/'+encodeURIComponent(event.id)+'/deputados');
      for(const a of attendees.dados||[]){
        const pid=deputyMap.get(String(a.id));
        if(pid && eligible.has(pid)){
          attendance.push({event_id:eventDbId,politician_id:pid,attendance_state:'present',source_id:source});
        }
      }
    }catch(e){
      failures.push({event_id:event.id,stage:'attendance',error:String(e.message||e)});
    }
  }

  if(updates.length){
    await db.query(
      `UPDATE chamber_events ce SET event_type=x.event_type,status=x.status,description=x.description,eligibility_mode=x.eligibility_mode,denominator_status=x.denominator_status
       FROM jsonb_to_recordset($1::jsonb) x(id uuid,event_type text,status text,description text,eligibility_mode text,denominator_status text)
       WHERE ce.id=x.id`,
      [JSON.stringify(updates)]
    );
  }

  if(eligibility.length){
    await db.query(
      `INSERT INTO chamber_event_eligibility(event_id,politician_id,eligibility_state,eligibility_source_id,eligibility_source_url,reference_date)
       SELECT event_id,politician_id,eligibility_state,source_id,source_url,reference_date
       FROM jsonb_to_recordset($1::jsonb) x(event_id uuid,politician_id uuid,eligibility_state text,source_id uuid,source_url text,reference_date date)
       ON CONFLICT(event_id,politician_id) DO UPDATE SET eligibility_state=EXCLUDED.eligibility_state,eligibility_source_id=EXCLUDED.eligibility_source_id,eligibility_source_url=EXCLUDED.eligibility_source_url,reference_date=EXCLUDED.reference_date,collected_at=now()`,
      [JSON.stringify(eligibility)]
    );
  }

  if(attendance.length){
    await db.query(
      `INSERT INTO chamber_event_attendance(event_id,politician_id,attendance_state,source_id)
       SELECT event_id,politician_id,attendance_state,source_id
       FROM jsonb_to_recordset($1::jsonb) x(event_id uuid,politician_id uuid,attendance_state text,source_id uuid)
       ON CONFLICT(politician_id,event_id) DO UPDATE SET attendance_state=EXCLUDED.attendance_state,source_id=EXCLUDED.source_id,collected_at=now()`,
      [JSON.stringify(attendance)]
    );
  }

  return res.json({
    status:failures.length?'partial':'ok',
    year,start,end,
    target_events:targetEvents.length,
    plenary_events:plenaryEvents,
    eligible_records:eligibility.length,
    presence_records:attendance.length,
    history_checked:ids.length,
    failures:failures.slice(0,20),
    denominator_policy:'Plenário: situação mais recente do histórico do deputado até a data do evento; comissões: membro do órgão + histórico de exercício na data; ausência sem registro não é presumida.'
  });
}