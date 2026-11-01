import { db } from 'hatchable';
export const access="public"; export const methods=["GET"];
export default async function(req,res){
 const {rows}=await db.query("SELECT id,type,reference_year,start_date,end_date,office,mandate_id,methodology_version FROM periods ORDER BY reference_year DESC");
 res.json({periods:rows});
}