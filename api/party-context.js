import { db } from 'hatchable';
export const access='public'; export const methods=['GET'];
export default async function(req,res){
 const party=req.query?.party,office=req.query?.office,year=Number(req.query?.year);
 if(!party||!office||!year)return res.status(400).json({error:'party, office e year são obrigatórios'});
 const r=await db.query('SELECT members_count,mean_score,mean_coverage,methodology_version,calculated_at FROM party_aggregates pa JOIN periods p ON p.id=pa.period_id WHERE pa.party_id=$1 AND pa.office=$2 AND p.reference_year=$3 ORDER BY calculated_at DESC LIMIT 1',[party,office,year]);
 return res.json({party,office,year,context:r.rows[0]||null,interpretation:'Contexto estatístico descritivo; não representa julgamento do partido.'});
}