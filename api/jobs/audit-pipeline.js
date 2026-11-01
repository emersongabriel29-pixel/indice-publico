import { db } from 'hatchable';
export const access='scheduler'; export const methods=['POST'];
const OFFICES=['Deputados Federais','Senadores','Governadores','Presidente'];
export default async function(req,res){
 const year=Number(req.body?.year||new Date().getUTCFullYear());
 const periods=(await db.query(`SELECT DISTINCT ON (office) id,office,methodology_version FROM periods WHERE type='year' AND reference_year=$1 ORDER BY office,methodology_version DESC`,[year])).rows;
 const results=[],readiness=[];
 for(const p of periods){
  const q=(await db.query(`SELECT
   (SELECT count(*) FROM indicator_values WHERE period_id=$1 AND availability_state IN ('missing','pending_validation','unverified') AND (raw_value IS NOT NULL OR normalized_value IS NOT NULL)) invalid_missing,
   (SELECT count(*) FROM indicator_values WHERE period_id=$1 AND availability_state='observed' AND (source_url IS NULL OR source_id IS NULL)) observed_no_source,
   (SELECT count(*) FROM score_snapshots WHERE period_id=$1 AND validity_status='valid' AND (final_score<0 OR final_score>100)) bad_snapshots,
   (SELECT count(*) FROM (SELECT politician_id,office,reference_year,methodology_version FROM score_snapshots WHERE period_id=$1 AND validity_status='valid' GROUP BY 1,2,3,4 HAVING count(*)>1) z) duplicate_active,
   (SELECT count(*) FROM chamber_events WHERE period_id=$1 AND denominator_status IN ('pending_historical_roster','invalid')) bad_attendance,
   (SELECT count(*) FROM chamber_votes WHERE period_id=$1) vote_events,
   (SELECT count(*) FROM chamber_vote_eligibility e JOIN chamber_votes v ON v.id=e.vote_id WHERE v.period_id=$1 AND e.eligibility_state='eligible') vote_eligibility,
   (SELECT count(*) FROM indicator_values WHERE period_id=$1 AND availability_state='provisional') provisional_indicators,
   (SELECT count(*) FROM score_snapshots WHERE period_id=$1 AND validity_status='valid' AND final_score IS NOT NULL) published_snapshots,
   (SELECT count(*) FROM votes WHERE period_id=$1 AND external_id IS NOT NULL)- (SELECT count(DISTINCT external_id) FROM votes WHERE period_id=$1 AND external_id IS NOT NULL) duplicate_votes`,[p.id])).rows[0];
  const d={year,office:p.office,methodology_version:p.methodology_version,invalid_missing_values:Number(q.invalid_missing),observed_without_source:Number(q.observed_no_source),bad_snapshots:Number(q.bad_snapshots),duplicate_active_snapshots:Number(q.duplicate_active),pending_or_invalid_attendance_events:Number(q.bad_attendance),voting_events:Number(q.vote_events),voting_eligibility_records:Number(q.vote_eligibility),provisional_indicators:Number(q.provisional_indicators),published_snapshots:Number(q.published_snapshots),duplicate_vote_records:Number(q.duplicate_votes)};
  const checks=[
   ['period_exists',true],
   ['no_missing_as_zero',d.invalid_missing_values===0],
   ['observed_has_source',d.observed_without_source===0],
   ['snapshots_in_0_100',d.bad_snapshots===0],
   ['active_snapshot_unique',d.duplicate_active_snapshots===0],
   ['attendance_denominator_gate',d.pending_or_invalid_attendance_events===0],
   ['vote_denominator_gate',d.voting_events===0||d.voting_eligibility_records>0],
   ['no_duplicate_vote_records',d.duplicate_vote_records===0],
   ['no_provisional_indicator_as_score_input',d.provisional_indicators===0]
  ];
  const failed=checks.filter(x=>!x[1]).map(x=>x[0]);
  results.push(...checks.map(([name,ok])=>({period:p.id,office:p.office,name,status:ok?'pass':'fail',details:d})));
  await db.query("INSERT INTO audit_checks(check_name,period_id,status,details) VALUES($1,$2,$3,$4)",['comprehensive_release_audit',p.id,failed.length?'fail':'pass',JSON.stringify({checks,d})]);
  readiness.push({office:p.office,methodology_version:p.methodology_version,published_snapshots:d.published_snapshots,ready:failed.length===0&&d.published_snapshots>0,blocking_reasons:[...failed,...(d.published_snapshots===0?['no_published_score']:[])]});
 }
 for(const office of OFFICES)if(!periods.some(x=>x.office===office))readiness.push({office,ready:false,blocking_reasons:['period_missing']});
 const failures=results.filter(x=>x.status==='fail').length;
 return res.json({status:failures?'fail':'ok',year,checks:results,failures,release_ready:failures===0&&readiness.every(x=>x.ready),readiness});
}