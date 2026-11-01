import { db } from 'hatchable';
export const access='scheduler'; export const methods=['POST'];
export default async function(req,res){
 const year=Number(req.body?.year||new Date().getUTCFullYear());
 const period=(await db.query("SELECT id FROM periods WHERE type='year' AND reference_year=$1 AND office='Deputados Federais' AND methodology_version='1.1' LIMIT 1",[year])).rows[0];
 if(!period)return res.status(404).json({error:'period not found',year});
 const source=(await db.query("SELECT id,url FROM sources WHERE institution='Câmara dos Deputados' ORDER BY collected_at DESC LIMIT 1")).rows[0];
 const rows=(await db.query(`WITH d AS (SELECT id FROM politicians WHERE office='Deputados Federais'),
 v AS (SELECT politician_id,count(DISTINCT external_id)::numeric c FROM votes WHERE period_id=$1 AND availability_state='observed' GROUP BY politician_id),
 elig AS (SELECT politician_id,count(*)::numeric c FROM chamber_vote_eligibility e JOIN chamber_votes cv ON cv.id=e.vote_id WHERE cv.period_id=$1 AND e.eligibility_state='eligible' GROUP BY politician_id),
 a AS (SELECT politician_id,count(*)::numeric c FROM proposition_authors WHERE period_id=$1 GROUP BY politician_id),
 t AS (SELECT a.politician_id,count(*)::numeric c FROM proposition_tramitation t JOIN proposition_authors a ON a.proposition_id=t.proposition_id AND a.period_id=t.period_id WHERE t.period_id=$1 GROUP BY a.politician_id),
 e AS (SELECT politician_id,count(*)::numeric c FROM expenses WHERE period_id=$1 AND availability_state='observed' GROUP BY politician_id),
 attend_e AS (SELECT ee.politician_id,count(*)::numeric c FROM chamber_event_eligibility ee JOIN chamber_events ce ON ce.id=ee.event_id WHERE ce.period_id=$1 AND ce.denominator_status IN ('validated_from_historical_exercise','validated_from_membership') GROUP BY ee.politician_id),
 attend_p AS (SELECT ca.politician_id,count(*)::numeric c FROM chamber_event_attendance ca JOIN chamber_events ce ON ce.id=ca.event_id WHERE ce.period_id=$1 AND ce.denominator_status IN ('validated_from_historical_exercise','validated_from_membership') AND ca.attendance_state='present' GROUP BY ca.politician_id)
 SELECT d.id,v.c votes,elig.c eligible_votes,a.c authored,t.c tram,e.c expenses,attend_e.c eligible_attendance,attend_p.c present
 FROM d LEFT JOIN v ON v.politician_id=d.id LEFT JOIN elig ON elig.politician_id=d.id LEFT JOIN a ON a.politician_id=d.id LEFT JOIN t ON t.politician_id=d.id LEFT JOIN e ON e.politician_id=d.id LEFT JOIN attend_e ON attend_e.politician_id=d.id LEFT JOIN attend_p ON attend_p.politician_id=d.id`,[period.id])).rows;
 const out=[];
 for(const x of rows){
  if(Number(x.eligible_attendance)>0)out.push({pid:x.id,indicator:'attendance_rate',raw:Number(x.present||0),norm:Math.min(100,Number(x.present||0)/Number(x.eligible_attendance)*100),state:'observed'});
  if(Number(x.eligible_votes)>0)out.push({pid:x.id,indicator:'voting_participation',raw:Number(x.votes||0),norm:Math.min(100,Number(x.votes||0)/Number(x.eligible_votes)*100),state:'observed'});
  if(x.authored!==null)out.push({pid:x.id,indicator:'production',raw:Number(x.authored),norm:null,state:'observed'});
  if(x.tram!==null)out.push({pid:x.id,indicator:'tramitation',raw:Number(x.tram),norm:Math.min(100,Number(x.tram)/Math.max(1,Number(x.authored||0)*2)*100),state:'observed'});
  if(x.expenses!==null)for(const indicator of ['expense_documentation','expense_regularities'])out.push({pid:x.id,indicator,raw:Number(x.expenses),norm:100,state:'provisional'});
 }
 if(out.length)await db.query(`INSERT INTO indicator_values(politician_id,office,period_id,indicator,raw_value,normalized_value,availability_state,source_id,source_url,collected_at,calculation_hash)
 SELECT pid,'Deputados Federais',$1,indicator,raw,norm,state,$3,$4,now(),'v1.1-denominators'
 FROM jsonb_to_recordset($2::jsonb) x(pid uuid,indicator text,raw numeric,norm numeric,state text)
 ON CONFLICT(politician_id,period_id,indicator) DO UPDATE SET raw_value=EXCLUDED.raw_value,normalized_value=EXCLUDED.normalized_value,availability_state=EXCLUDED.availability_state,source_id=EXCLUDED.source_id,source_url=EXCLUDED.source_url,collected_at=now(),calculation_hash=EXCLUDED.calculation_hash`,[period.id,JSON.stringify(out),source?.id||null,source?.url||'https://dadosabertos.camara.leg.br/']);
 return res.json({status:'ok',year,processed:rows.length,indicators:out.length,voting_denominator:'historical exercise by vote date',attendance_denominator:'validated event eligibility',provisional:['expense_documentation','expense_regularities']});
}