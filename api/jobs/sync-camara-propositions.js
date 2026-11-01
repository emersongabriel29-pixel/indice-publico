import { db } from 'hatchable';
export const access='scheduler'; export const methods=['POST'];
const BASE='https://dadosabertos.camara.leg.br/api/v2';
async function getJson(url){const r=await fetch(url,{headers:{accept:'application/json'}});if(!r.ok)throw new Error('Câmara HTTP '+r.status);return r.json();}
export default async function(req,res){
 const year=Number(req.body?.year||new Date().getUTCFullYear()),mode=req.body?.mode||'propositions';
 const period=(await db.query("SELECT id FROM periods WHERE type='year' AND reference_year=$1 AND office='Deputados Federais' AND methodology_version='1.0' LIMIT 1",[year])).rows[0];
 if(!period)return res.status(404).json({error:'period not found'});
 if(mode==='propositions'){
  const page=Math.max(1,Number(req.body?.page||1)),d=await getJson(`${BASE}/proposicoes?ano=${year}&itens=100&pagina=${page}&ordem=ASC&ordenarPor=id`),rows=(d.dados||[]).map(x=>({id:String(x.id),type:x.siglaTipo||null,number:x.numero?String(x.numero):null,year,subject:x.ementa||null,status:x.statusProposicao?.descricaoSituacao||null}));
  if(rows.length)await db.query(`INSERT INTO propositions(id,type,number,year,subject,status,external_id,availability_state,collected_at) SELECT id,type,number,year,subject,status,id,'observed',now() FROM jsonb_to_recordset($1::jsonb) AS x(id text,type text,number text,year int,subject text,status text) ON CONFLICT(id) DO UPDATE SET type=EXCLUDED.type,number=EXCLUDED.number,subject=EXCLUDED.subject,status=EXCLUDED.status,collected_at=now()`,[JSON.stringify(rows)]);
  return res.json({status:'ok',mode,year,page,received:rows.length,next_page:rows.length===100?page+1:null});
 }
 const offset=Math.max(0,Number(req.body?.offset||0)),props=(await db.query("SELECT id FROM propositions WHERE year=$1 ORDER BY id LIMIT 5 OFFSET $2",[year,offset])).rows;let stored=0;
 for(const p of props){const d=await getJson(`${BASE}/proposicoes/${encodeURIComponent(p.id)}/${mode==='authors'?'autores':'tramitacoes'}`);for(const x of(d.dados||[])){if(mode==='authors'){const ext=String(x.uri||x.id||x.nome||'unknown').split('/').pop();const local=(await db.query("SELECT id FROM politicians WHERE official_id=$1 LIMIT 1",[ext])).rows[0];await db.query(`INSERT INTO proposition_authors(proposition_id,politician_id,author_external_id,author_name,author_type,period_id) VALUES($1,$2,$3,$4,$5,$6) ON CONFLICT(proposition_id,period_id,author_external_id) DO UPDATE SET politician_id=EXCLUDED.politician_id,author_name=EXCLUDED.author_name,author_type=EXCLUDED.author_type`,[p.id,local?.id||null,ext,x.nome||null,x.tipoAutor?.descricao||x.tipoAutor||null,period.id]);}else await db.query(`INSERT INTO proposition_tramitation(proposition_id,period_id,event_date,tramitation_type,description,status) VALUES($1,$2,$3,$4,$5,$6) ON CONFLICT(proposition_id,period_id,event_date,tramitation_type,description) DO UPDATE SET status=EXCLUDED.status`,[p.id,period.id,x.data||null,x.siglaOrgao||x.tipoTramitacao||null,x.descricao||x.texto||null,x.situacao||null]);stored++;}}
 return res.json({status:'ok',mode,year,propositions:props.length,stored,next_offset:props.length?offset+props.length:null});
}