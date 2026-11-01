import { db } from 'hatchable';
export const access='public'; export const methods=['GET'];
export default async function(req,res){
 const id=req.query?.politician_id,year=Number(req.query?.year);
 if(!id||!year)return res.status(400).json({error:'politician_id e year são obrigatórios'});
 const snap=await db.query('SELECT * FROM score_snapshots WHERE politician_id=$1 AND reference_year=$2 ORDER BY calculated_at DESC',[id,year]);
 const dims=await db.query('SELECT * FROM score_dimensions WHERE politician_id=$1 AND reference_year=$2 ORDER BY id',[id,year]);
 return res.json({snapshots:snap.rows,dimensions:dims.rows,audit_path:['resultado','dimensão','indicador','valor bruto','normalização','fórmula','peso','fonte']});
}