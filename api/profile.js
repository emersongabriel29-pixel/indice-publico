import { db } from 'hatchable';
export const access='public'; export const methods=['GET'];
export default async function(req,res){
 const id=req.query?.id;if(!id)return res.status(400).json({error:'id é obrigatório'});
 const p=await db.query('SELECT id,name,ballot_name,office,state,party,status,official_id FROM politicians WHERE id=$1 OR official_id=$1 LIMIT 1',[id]);
 if(!p.rows.length)return res.status(404).json({error:'Político não encontrado'});
 const person=p.rows[0];
 const [history,mandates,party,legal,commitments,expenses]=await Promise.all([
  db.query('SELECT reference_year,final_score,coverage,methodology_version,validity_status,invalidated_reason,calculated_at FROM score_snapshots WHERE politician_id=$1 ORDER BY reference_year DESC,calculated_at DESC',[person.id]),
  db.query('SELECT office,start_date,end_date,legislature_id,state FROM mandates WHERE politician_id=$1 ORDER BY start_date DESC',[person.id]),
  db.query('SELECT party_id,start_date,end_date,period_id FROM party_membership WHERE politician_id=$1 ORDER BY start_date DESC',[person.id]),
  db.query('SELECT case_reference,status,court,record_date,period_id FROM legal_records WHERE politician_id=$1 ORDER BY record_date DESC',[person.id]),
  db.query('SELECT commitment,target,deadline,achieved,status,evidence_source,period_id FROM commitments WHERE politician_id=$1 ORDER BY deadline DESC',[person.id]),
  db.query('SELECT category,amount,expense_date,period_id FROM expenses WHERE politician_id=$1 ORDER BY expense_date DESC LIMIT 200',[person.id])
 ]);
 return res.json({politician:person,history:history.rows,mandates:mandates.rows,party_membership:party.rows,legal_records:legal.rows,commitments:commitments.rows,expenses:expenses.rows});
}