import { db } from 'hatchable';
export const access='scheduler'; export const methods=['POST'];
const API='https://dadosabertos.tse.jus.br/api/3/action/package_show';
async function packageInfo(id){const r=await fetch(API+'?id='+encodeURIComponent(id));if(!r.ok)throw new Error('HTTP '+r.status);return(await r.json()).result;}
export default async function(req,res){try{
 const year=Number(req.body?.year||2026),ids=['candidatos-'+year,'prestacao-de-contas-eleitorais-'+year],found=[];
 for(const id of ids){try{const p=await packageInfo(id);for(const x of(p.resources||[]))if(x.url)found.push({dataset:id,name:x.name,format:x.format,url:x.url});}catch(e){found.push({dataset:id,error:String(e.message||e)})}}
 const unique=[...new Map(found.filter(x=>x.url).map(x=>[x.url,x])).values()];
 if(unique.length){await db.query(`INSERT INTO sources(institution,url,source_type,reliability,source_version,document_hash) SELECT 'Tribunal Superior Eleitoral',x.url,'dataset','primary',$1,NULL FROM jsonb_to_recordset($2::jsonb)x(url text) ON CONFLICT DO NOTHING`,[String(year),JSON.stringify(unique.map(x=>({url:x.url})))]);await db.query(`INSERT INTO electoral_source_manifests(election_year,dataset,resource_name,format,url) SELECT $1,x.dataset,x.name,x.format,x.url FROM jsonb_to_recordset($2::jsonb)x(dataset text,name text,format text,url text) ON CONFLICT DO NOTHING`,[year,JSON.stringify(unique)]);}
 await db.query("INSERT INTO sync_state(source_key,last_run_at,last_status,last_error) VALUES($1,now(),'ok',NULL) ON CONFLICT(source_key) DO UPDATE SET last_run_at=now(),last_status='ok',last_error=NULL,updated_at=now()",['tse-metadata-'+year]);
 return res.json({status:'ok',year,datasets:ids.length,resources:unique.length,manifest_stored:true,resources_list:unique});
}catch(e){return res.status(502).json({status:'error',error:String(e.message||e)})}}