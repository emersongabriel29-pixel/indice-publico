import { db } from 'hatchable';
export const access='scheduler'; export const methods=['POST'];
export default async function(req,res){
 const year=Number(req.body?.year||new Date().getUTCFullYear());
 const period=(await db.query("SELECT id FROM periods WHERE type='year' AND reference_year=$1 AND office='Deputados Federais' AND methodology_version='1.0' LIMIT 1",[year])).rows[0];
 if(!period)return res.status(404).json({error:'period not found'});
 const src=(await db.query("SELECT id FROM sources WHERE institution='Câmara dos Deputados' LIMIT 1")).rows[0]?.id||null;
 const r=await db.query(`INSERT INTO indicator_values(politician_id,office,period_id,indicator,raw_value,normalized_value,availability_state,source_id,source_url,collected_at,calculation_hash)
 SELECT p.id,'Deputados Federais',$1,'voting_participation',NULL,NULL,'pending_validation',$2,'https://dadosabertos.camara.leg.br/api/v2/votacoes',now(),'v1.1-voting-participation-denominator'
 FROM politicians p
 WHERE p.office='Deputados Federais'
 AND NOT EXISTS (SELECT 1 FROM votes v WHERE v.politician_id=p.id AND v.period_id=$1 AND v.availability_state='observed')
 ON CONFLICT(politician_id,period_id,indicator) DO UPDATE SET raw_value=NULL,normalized_value=NULL,availability_state='pending_validation',source_id=EXCLUDED.source_id,source_url=EXCLUDED.source_url,collected_at=now(),calculation_hash=EXCLUDED.calculation_hash`,[period.id,src]);
 return res.json({status:'ok',year,period_id:period.id,rows_reclassified:r.rowCount,reason:'zero de votos nominais não é ausência comprovada nem participação zero; fica pendente até validar o denominador e elegibilidade'});
}