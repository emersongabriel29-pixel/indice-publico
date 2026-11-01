import { db } from 'hatchable';
export const access='scheduler'; export const methods=['POST'];
const BASE='https://dadosabertos.camara.leg.br/api/v2';
const FILE_BASE='https://www.camara.leg.br/cotas/Ano-';
async function getJson(url,attempts=4){let last;for(let i=0;i<attempts;i++){try{const r=await fetch(url,{headers:{accept:'application/json'}});if(r.ok)return await r.json();last=new Error('HTTP '+r.status);if(r.status<500&&r.status!==429)break;}catch(e){last=e}await new Promise(r=>setTimeout(r,700*(i+1)));}throw last||new Error('request failed')}
async function fetchText(url){const r=await fetch(url);if(!r.ok)throw new Error('HTTP '+r.status+' '+url);return r.text()}
export default async function(req,res){
 const year=Number(req.body?.year||new Date().getUTCFullYear());
 const mode=req.body?.mode||'api';
 const src=(await db.query("SELECT id,url FROM sources WHERE institution='Câmara dos Deputados' LIMIT 1")).rows[0];
 if(mode==='catalog'){return res.json({status:'ok',year,expense_file_csv:FILE_BASE+year+'.csv.zip',expense_file_json:FILE_BASE+year+'.json.zip',api:BASE})}
 const stateKey='camara-expenses-'+year;
 const st=(await db.query('SELECT cursor_value FROM sync_state WHERE source_key=$1',[stateKey])).rows[0];
 const offset=Number(st?.cursor_value||0);
 const people=(await db.query("SELECT id,official_id FROM politicians WHERE office='Deputados Federais' ORDER BY official_id OFFSET $1 LIMIT 5",[offset])).rows;
 if(!people.length){await db.query("UPDATE sync_state SET cursor_value=0,last_run_at=now(),last_status='complete',last_error=NULL WHERE source_key=$1",[stateKey]);return res.json({status:'complete',year});}
 let processed=0,rows=0,failed=[];
 for(const p of people){try{
   const j=await getJson(BASE+'/deputados/'+encodeURIComponent(p.official_id)+'/despesas?ano='+year+'&itens=100');
   const data=j.dados||[];
   for(const x of data){
    const ext=String(x.id||[p.official_id,x.ano,x.dataDocumento,x.codDocumento,x.valorLiquido,x.tipoDespesa].join('|'));
    await db.query(`INSERT INTO expenses(politician_id,category,amount,expense_date,period_id,source_id,external_id,availability_state)
      SELECT $1,$2,$3,$4::date,pe.id,$5,$6,'observed' FROM periods pe WHERE pe.type='year' AND pe.reference_year=$7 AND pe.office='Deputados Federais' AND pe.methodology_version='1.1'
      ON CONFLICT(external_id) WHERE external_id IS NOT NULL DO UPDATE SET category=EXCLUDED.category,amount=EXCLUDED.amount,expense_date=EXCLUDED.expense_date,source_id=EXCLUDED.source_id,collected_at=now()`,
      [p.id,x.tipoDespesa||'Não informado',Number(x.valorLiquido??x.valorDocumento??0)||0,(x.dataDocumento||'').slice(0,10),src?.id||null,ext,year]);
   } rows+=data.length;processed++;
  }catch(e){failed.push({id:p.official_id,error:String(e.message||e)})}}
 const next=offset+people.length;
 await db.query(`INSERT INTO sync_state(source_key,cursor_value,last_run_at,last_status,last_error) VALUES($1,$2,now(),$3,$4)
 ON CONFLICT(source_key) DO UPDATE SET cursor_value=$2,last_run_at=now(),last_status=$3,last_error=$4,updated_at=now()`,[stateKey,next,failed.length?'partial':'ok',failed.length?JSON.stringify(failed):null]);
 return res.json({status:failed.length?'partial':'ok',year,processed,rows,next_offset:next,total:513,failed,source:'Câmara dos Deputados'});
}