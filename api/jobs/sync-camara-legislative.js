import { db } from 'hatchable';
export const access='scheduler'; export const methods=['POST'];
const BASE='https://dadosabertos.camara.leg.br/api/v2';
async function j(u){for(let i=0;i<4;i++){try{const r=await fetch(u,{headers:{accept:'application/json'}});if(r.ok)return r.json();if(r.status<500&&r.status!==429)throw new Error('HTTP '+r.status);}catch(e){if(i===3)throw e}await new Promise(r=>setTimeout(r,700*(i+1)))}} 
export default async function(req,res){
 const year=Number(req.body?.year||new Date().getUTCFullYear()),mode=req.body?.mode||'votes',result={year,mode,votacoes:0,votos:0,status:'ok'};
 try{
  const src=(await db.query("SELECT id FROM sources WHERE institution='Câmara dos Deputados' LIMIT 1")).rows[0]?.id;
  const period=(await db.query("SELECT id FROM periods WHERE type='year' AND reference_year=$1 AND office='Deputados Federais' AND methodology_version='1.1' LIMIT 1",[year])).rows[0]?.id;
  const deputies=(await db.query("SELECT id,official_id FROM politicians WHERE office='Deputados Federais'")).rows, map=new Map(deputies.map(x=>[String(x.official_id),x.id]));
  if(mode==='votes'){
   const stateKey='camara-votacoes-'+year,state=(await db.query("SELECT cursor_value FROM sync_state WHERE source_key=$1 LIMIT 1",[stateKey])).rows[0],page=Number(req.body?.page||state?.cursor_value||1),start=req.body?.start||year+'-01-01',end=req.body?.end||year+'-12-31';
   const list=(await j(BASE+'/votacoes?dataInicio='+start+'&dataFim='+end+'&itens=100&pagina='+page))?.dados||[],batch=[];
   for(const v of list){const vid=String(v.id||'');if(!vid)continue;result.votacoes++;const date=v.data||v.dataHoraRegistro?.slice(0,10)||null,prop=v.proposicaoObjeto?.id?String(v.proposicaoObjeto.id):null;
    await db.query(`INSERT INTO chamber_votes(external_id,office,period_id,proposition_id,vote_date,description,result,source_id) VALUES($1,'Deputados Federais',$2,$3,$4,$5,$6,$7) ON CONFLICT(external_id) DO UPDATE SET vote_date=EXCLUDED.vote_date,description=EXCLUDED.description,result=EXCLUDED.result,source_id=EXCLUDED.source_id`,[vid,period,prop,date,v.descricao||v.objeto||null,v.resultado||v.resultadoVotacao||null,src]);
    const vr=(await j(BASE+'/votacoes/'+encodeURIComponent(vid)+'/votos'))?.dados||[];
    for(const item of vr){const did=item.deputado_?.id||item.deputado?.id,vote=item.tipoVoto||item.voto||item.votoDescricao||null,pid=map.get(String(did));if(!pid||!vote)continue;batch.push({external_id:vid+'-'+String(did),politician_id:pid,proposition_id:prop,vote,vote_date:date,period_id:period,source_id:src});result.votos++;}
   }
   if(batch.length)await db.query(`INSERT INTO votes(external_id,politician_id,proposition_id,vote,vote_date,period_id,source_id,availability_state) SELECT x.external_id,x.politician_id,x.proposition_id,x.vote,x.vote_date,x.period_id,x.source_id,'observed' FROM jsonb_to_recordset($1::jsonb) x(external_id text,politician_id uuid,proposition_id text,vote text,vote_date date,period_id uuid,source_id uuid) WHERE NOT EXISTS(SELECT 1 FROM votes old WHERE old.external_id=x.external_id)`,[JSON.stringify(batch)]);
   const total=Number((await db.query("SELECT count(*)::int n FROM chamber_votes WHERE period_id=$1",[period])).rows[0]?.n||0);
   await db.query(`INSERT INTO indicator_values(politician_id,office,period_id,indicator,raw_value,normalized_value,availability_state,source_id,source_url,calculation_hash)
    SELECT p.id,'Deputados Federais',$1,'voting_participation',CASE WHEN COUNT(DISTINCT v.external_id)>0 THEN COUNT(DISTINCT v.external_id) ELSE NULL END,
    CASE WHEN COUNT(DISTINCT v.external_id)>0 AND $2>0 THEN LEAST(100,COUNT(DISTINCT v.external_id)::numeric*100/$2) ELSE NULL END,
    'pending_validation',$3,'https://dadosabertos.camara.leg.br/api/v2/votacoes','v1.1-voting-participation-awaiting-eligibility'
    FROM politicians p LEFT JOIN votes v ON v.politician_id=p.id AND v.period_id=$1 AND v.availability_state='observed' WHERE p.office='Deputados Federais' GROUP BY p.id
    ON CONFLICT(politician_id,period_id,indicator) DO UPDATE SET raw_value=EXCLUDED.raw_value,normalized_value=EXCLUDED.normalized_value,availability_state=EXCLUDED.availability_state,source_id=EXCLUDED.source_id,source_url=EXCLUDED.source_url,collected_at=now(),calculation_hash=EXCLUDED.calculation_hash`,[period,total,src]);
   await db.query(`INSERT INTO sync_state(source_key,cursor_value,last_run_at,last_status,last_error,updated_at) VALUES($1,$2,now(),'ok',NULL,now()) ON CONFLICT(source_key) DO UPDATE SET cursor_value=EXCLUDED.cursor_value,last_run_at=now(),last_status='ok',last_error=NULL,updated_at=now()`,[stateKey,page+1]);
   return res.json({...result,total_voting_events:total,denominator_status:'provisional'});
  }
  return res.status(400).json({error:'Use mode=votes; attendance remains separate until eligible-participant denominator is validated.'});
 }catch(e){return res.status(502).json({status:'partial',year,error:String(e.message||e),result})}
}