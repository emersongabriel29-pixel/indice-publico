import { db } from 'hatchable';
export const access='public'; export const methods=['GET'];
export default async function(req,res){
 const r=await db.query('SELECT id,institution,url,source_type,collected_at,reliability,source_version FROM sources ORDER BY collected_at DESC LIMIT 100');
 return res.json({sources:r.rows});
}