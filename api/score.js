import { db } from 'hatchable';
import { METHODOLOGY_VERSION, WEIGHTS } from 'lib/scoring.js';
export const access='public'; export const methods=['GET'];
export default async function(req,res){
 const office=req.query?.office,politicianId=req.query?.politician_id,year=Number(req.query?.year);
 if(!office||!politicianId||!year)return res.status(400).json({error:'office, politician_id e year são obrigatórios'});
 const p=await db.query('SELECT id,name,ballot_name,office,state,party,status FROM politicians WHERE id=$1',[politicianId]);
 if(!p.rows.length)return res.status(404).json({error:'Político não encontrado'});
 const period=await db.query('SELECT id,methodology_version FROM periods WHERE type=\'year\' AND reference_year=$1 AND office=$2 ORDER BY methodology_version DESC LIMIT 1',[year,office]);
 if(!period.rows.length)return res.status(404).json({error:'Período não encontrado'});
 const version=period.rows[0].methodology_version;
 const rows=await db.query('SELECT criterion,raw_value,normalized_value,points,source_snapshot_id,calculated_at FROM score_dimensions WHERE politician_id=$1 AND office=$2 AND reference_year=$3 AND methodology_version=$4 ORDER BY id',[politicianId,office,year,version]);
 const snap=await db.query('SELECT id,final_score,coverage,calculated_at,input_hash,methodology_hash,validity_status,invalidated_reason FROM score_snapshots WHERE politician_id=$1 AND office=$2 AND reference_year=$3 AND methodology_version=$4 AND validity_status=\'valid\' ORDER BY calculated_at DESC LIMIT 1',[politicianId,office,year,version]);
 return res.json({politician:p.rows[0],office,year,methodology_version:version,weights:WEIGHTS[office],score:snap.rows[0]?.final_score??null,coverage:snap.rows[0]?.coverage??0,status:snap.rows[0]?.final_score==null?'insufficient_data':'calculated',dimensions:rows.rows,explanation:'Resultado determinístico; dados ausentes não são tratados como zero.'});
}