import { db } from 'hatchable';
export const access='scheduler'; export const methods=['POST'];
export default async function(req,res){
 const src=await db.query("SELECT id FROM sources WHERE institution='Câmara dos Deputados' LIMIT 1");
 const all=[];
 for(let page=1;page<=6;page++){
  const url='https://dadosabertos.camara.leg.br/api/v2/deputados?ordem=ASC&ordenarPor=nome&itens=100&pagina='+page;
  const r=await fetch(url); if(!r.ok) return res.status(502).json({error:'Câmara HTTP '+r.status});
  const data=await r.json(); const rows=data.dados||[]; all.push(...rows); if(rows.length<100)break;
 }
 if(!all.length)return res.status(502).json({error:'A Câmara não retornou parlamentares'});
 const payload=all.map(d=>({official_id:String(d.id),name:d.nome,party:d.siglaPartido,state:d.siglaUf,status:d.uri}));
 await db.query("WITH input AS (SELECT * FROM jsonb_to_recordset($1::jsonb) AS x(official_id text,name text,party text,state text,status text)) INSERT INTO politicians(official_id,name,ballot_name,office,state,party,status,source_id) SELECT official_id,name,name,'Deputados Federais',state,party,status,$2 FROM input ON CONFLICT(official_id) DO UPDATE SET name=EXCLUDED.name,ballot_name=EXCLUDED.ballot_name,state=EXCLUDED.state,party=EXCLUDED.party,status=EXCLUDED.status,source_id=EXCLUDED.source_id,updated_at=now()",[JSON.stringify(payload),src.rows[0]?.id]);
 await db.query("INSERT INTO sync_state(source_key,last_run_at,last_status,last_error,updated_at) VALUES('camara-roster',now(),'ok',NULL,now()) ON CONFLICT(source_key) DO UPDATE SET last_run_at=now(),last_status='ok',last_error=NULL,updated_at=now()");
 return res.json({status:'ok',count:all.length,source:'Câmara dos Deputados'});
}