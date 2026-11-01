import { db } from 'hatchable';
export const access='scheduler'; export const methods=['POST'];
const BASE='https://dadosabertos.camara.leg.br/api/v2';
async function getJson(url,attempts=4){
 let last;
 for(let i=0;i<attempts;i++){
  try{const r=await fetch(url,{headers:{accept:'application/json'}});if(r.ok)return await r.json();last=new Error('HTTP '+r.status);if(r.status<500&&r.status!==429)break}catch(e){last=e}
  await new Promise(r=>setTimeout(r,500*(i+1)));
 }
 throw last||new Error('request failed');
}
async function fetchHistory(id){const j=await getJson(BASE+'/deputados/'+encodeURIComponent(id)+'/historico');return j.dados||[]}
function activeOn(history,date){
 const rows=(history||[]).filter(x=>String(x.dataHora||'').slice(0,10)<=date).sort((a,b)=>String(a.dataHora||'').localeCompare(String(b.dataHora||'')));
 if(!rows.length)return false;
 return String(rows[rows.length-1].situacao||'').toUpperCase()==='EXERCÍCIO';
}
export default async function(req,res){
 const year=Number(req.body?.year||new Date().getUTCFullYear());
 const period=(await db.query("SELECT id FROM periods WHERE type='year' AND reference_year=$1 AND office='Deputados Federais' AND methodology_version=$2 LIMIT 1",[year,'1.1'])).rows[0];
 if(!period)return res.status(404).json({error:'period not found',year});
 const source=(await db.query("SELECT id FROM sources WHERE institution='Câmara dos Deputados' LIMIT 1")).rows[0]?.id||null;
 const deputies=(await db.query("SELECT id,official_id FROM politicians WHERE office='Deputados Federais'")).rows;
 const votes=(await db.query("SELECT id,external_id,vote_date FROM chamber_votes WHERE period_id=$1 ORDER BY vote_date,id",[period.id])).rows;
 const histories=new Map(), failures=[];
 for(let i=0;i<deputies.length;i+=25){
  const batch=deputies.slice(i,i+25);
  const got=await Promise.all(batch.map(async d=>{try{return [String(d.official_id),await fetchHistory(d.official_id)]}catch(e){failures.push({deputy_id:d.official_id,error:String(e.message||e)});return [String(d.official_id),[]]}}));
  for(const [id,h] of got)histories.set(id,h);
 }
 const rows=[];
 for(const v of votes){
  const date=String(v.vote_date||'').slice(0,10);
  if(!date)continue;
  for(const d of deputies) if(activeOn(histories.get(String(d.official_id)),date))
    rows.push({vote_id:v.id,politician_id:d.id,eligibility_state:'eligible',source_id:source,source_url:BASE+'/deputados/{id}/historico',reference_date:date});
 }
 for(let i=0;i<rows.length;i+=500){
  const batch=rows.slice(i,i+500);
  await db.query(`INSERT INTO chamber_vote_eligibility(vote_id,politician_id,eligibility_state,eligibility_source_id,eligibility_source_url,reference_date)
   SELECT vote_id,politician_id,eligibility_state,source_id,source_url,reference_date
   FROM jsonb_to_recordset($1::jsonb) x(vote_id uuid,politician_id uuid,eligibility_state text,source_id uuid,source_url text,reference_date date)
   ON CONFLICT(vote_id,politician_id) DO UPDATE SET eligibility_state=EXCLUDED.eligibility_state,eligibility_source_id=EXCLUDED.eligibility_source_id,eligibility_source_url=EXCLUDED.eligibility_source_url,reference_date=EXCLUDED.reference_date,collected_at=now()`,[JSON.stringify(batch)]);
 }
 return res.json({status:failures.length?'partial':'ok',year,voting_events:votes.length,eligible_records:rows.length,history_checked:deputies.length,failures:failures.slice(0,20),denominator_policy:'votação nominal: deputado elegível quando o histórico oficial indica EXERCÍCIO na data da votação.'});
}