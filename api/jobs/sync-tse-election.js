import { db } from 'hatchable';
export const access='scheduler'; export const methods=['POST'];
const API='https://dadosabertos.tse.jus.br/api/3/action/package_show';
async function info(id){const r=await fetch(API+'?id='+encodeURIComponent(id));if(!r.ok)throw new Error('HTTP '+r.status);return (await r.json()).result}
export default async function(req,res){
 const year=Number(req.body?.year||2024), ids=['candidatos-'+year,'prestacao-de-contas-eleitorais-'+year], resources=[];
 for(const id of ids){try{const p=await info(id);for(const x of p.resources||[]){if(x.url)resources.push({dataset:id,name:x.name,format:x.format,url:x.url})}}catch(e){}}
 const rows=resources.filter(x=>/Candidatos$|Bens de candidatos|Presta.+o de contas de candidatos/i.test(x.name));
 for(const x of rows) await db.query("INSERT INTO sources(institution,url,source_type,reliability,source_version,document_hash) VALUES('Tribunal Superior Eleitoral',$1,'dataset','primary',$2,NULL) ON CONFLICT DO NOTHING",[x.url,String(year)]);
 return res.json({status:'cataloged',year,resources:rows.length,items:rows});
}