import { db } from 'hatchable';
export const access='scheduler'; export const methods=['POST'];
export default async function(req,res){
 const year=Number(req.body?.year||new Date().getUTCFullYear()),office=req.body?.office||'Deputados Federais';
 const period=(await db.query("SELECT id FROM periods WHERE type='year' AND reference_year=$1 AND office=$2 AND methodology_version='1.0' LIMIT 1",[year,office])).rows[0];
 if(!period)return res.status(404).json({error:'period not found'});
 const rows=(await db.query(`SELECT p.party,count(*)::int members,avg(s.final_score) mean_score,avg(s.coverage) mean_coverage FROM politicians p JOIN LATERAL (SELECT final_score,coverage FROM score_snapshots s WHERE s.politician_id=p.id AND s.period_id=$1 AND s.office=$2 AND s.final_score IS NOT NULL ORDER BY calculated_at DESC LIMIT 1)s ON true WHERE p.office=$2 AND p.party IS NOT NULL GROUP BY p.party`,[period.id,office])).rows;
 for(const r of rows)await db.query(`INSERT INTO party_aggregates(party_id,office,period_id,members_count,mean_score,mean_coverage,methodology_version,calculated_at) VALUES($1,$2,$3,$4,$5,$6,'1.0',now())`,[r.party,office,period.id,r.members,r.mean_score,r.mean_coverage]);
 return res.json({status:'ok',year,office,parties:rows.length,description:'agregado estatístico de membros comparáveis; não é julgamento normativo do partido'});
}