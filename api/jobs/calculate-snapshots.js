import { db } from 'hatchable';
import { METHODOLOGY_VERSION, WEIGHTS, weighted } from 'lib/scoring.js';
export const access='scheduler'; export const methods=['POST'];
const MIN_COVERAGE=.80;
const HASH='indice-publico-scoring-v1.1-null-safe';
export default async function(req,res){
 const year=Number(req.body?.year||new Date().getUTCFullYear()),office=req.body?.office||'Deputados Federais';
 const period=(await db.query("SELECT id FROM periods WHERE type='year' AND reference_year=$1 AND office=$2 AND methodology_version=$3 LIMIT 1",[year,office,METHODOLOGY_VERSION])).rows[0];
 if(!period)return res.status(404).json({error:'period not found'});
 if(!WEIGHTS[office])return res.status(400).json({error:'office not supported'});
 const rows=(await db.query(`SELECT p.id,COALESCE(jsonb_object_agg(iv.indicator,iv.normalized_value) FILTER(WHERE iv.indicator IS NOT NULL),'{}') indicators
 FROM politicians p LEFT JOIN indicator_values iv ON iv.politician_id=p.id AND iv.period_id=$1 AND iv.availability_state='observed' AND iv.normalized_value IS NOT NULL
 WHERE p.office=$2 GROUP BY p.id ORDER BY p.id`,[period.id,office])).rows;
 const snaps=[];
 for(const r of rows){
  const m=Object.fromEntries(Object.entries(r.indicators||{}).map(([k,v])=>[k,Number(v)]));
  let vals={};
  if(office==='Deputados Federais'){
   const participation=weighted({presence:m.attendance_rate,votes:m.voting_participation},{presence:.60,votes:.40});
   const legislative=weighted({tramitation:m.tramitation,results:undefined,committees:undefined,production:m.production},{tramitation:.30,results:.35,committees:.20,production:.15});
   const votes=weighted({registered_votes:m.voting_participation,completeness:m.voting_participation,documentation:undefined},{registered_votes:.50,completeness:.30,documentation:.20});
   const resources=weighted({regularity:m.expense_regularities,relative_expense:undefined,anomalies:undefined,documentation:m.expense_documentation},{regularity:.30,relative_expense:.30,anomalies:.20,documentation:.20});
   vals={participacao:participation.score,legislativa:legislative.score,votacoes:votes.score,recursos:resources.score,transparencia:undefined,compromissos:undefined,eleitoral:undefined};
  }
  const calc=weighted(vals,WEIGHTS[office]);
  const score=calc.coverage>=MIN_COVERAGE?calc.score:null;
  snaps.push({pid:r.id,score,coverage:calc.coverage,input_hash:JSON.stringify({year,office,pid:r.id,methodology:METHODOLOGY_VERSION,vals})});
 }
 if(snaps.length)await db.query(`INSERT INTO score_snapshots(politician_id,office,period_id,reference_year,methodology_version,final_score,coverage,calculated_at,input_hash,methodology_hash,validity_status)
 SELECT pid,$1,$2,$3,$4,score,coverage,now(),input_hash,$6,'valid' FROM jsonb_to_recordset($5::jsonb) x(pid uuid,score numeric,coverage numeric,input_hash text)
 ON CONFLICT (politician_id,office,reference_year,methodology_version) WHERE validity_status='valid'
 DO UPDATE SET final_score=EXCLUDED.final_score,coverage=EXCLUDED.coverage,calculated_at=EXCLUDED.calculated_at,input_hash=EXCLUDED.input_hash,methodology_hash=EXCLUDED.methodology_hash`,[office,period.id,year,METHODOLOGY_VERSION,JSON.stringify(snaps),HASH]);
 return res.json({status:'ok',year,office,total:rows.length,published:snaps.filter(x=>x.score!==null).length,blocked:snaps.filter(x=>x.score===null).length,min_coverage:MIN_COVERAGE,methodology_version:METHODOLOGY_VERSION,policy:'NULL e dados ausentes permanecem ausentes; nunca são convertidos em zero'});
}