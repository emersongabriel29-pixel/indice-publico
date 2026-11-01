import { db } from 'hatchable';
export const access='scheduler'; export const methods=['POST'];
const URL='https://legis.senado.leg.br/dadosabertos/senador/lista/atual';
function tag(xml,name){const a='<'+name+'>';const b='</'+name+'>';const i=xml.indexOf(a);if(i<0)return null;const j=xml.indexOf(b,i+a.length);return j<0?null:xml.slice(i+a.length,j).trim();}
export default async function(req,res){
 try{
  const r=await fetch(URL); if(!r.ok) throw new Error('HTTP '+r.status);
  const xml=await r.text(); let count=0, pos=0;
  const source=(await db.query("SELECT id FROM sources WHERE institution='Senado Federal' LIMIT 1")).rows[0]?.id;
  while(true){
    const s=xml.indexOf('<Parlamentar>',pos); if(s<0) break;
    const e=xml.indexOf('</Parlamentar>',s); if(e<0) break;
    const b=xml.slice(s,e);
    const id=tag(b,'CodigoParlamentar'), name=tag(b,'NomeParlamentar'); pos=e+14;
    if(!id||!name) continue;
    const full=tag(b,'NomeCompletoParlamentar')||name, party=tag(b,'SiglaPartidoParlamentar'), uf=tag(b,'IdentificacaoParlamentarUfParlamentar');
    await db.query("INSERT INTO politicians(official_id,name,ballot_name,office,state,party,status,source_id) VALUES($1,$2,$3,'Senadores',$4,$5,'ativo',$6) ON CONFLICT(official_id) DO UPDATE SET name=$2,ballot_name=$3,state=$4,party=$5,status='ativo',source_id=$6,updated_at=now()",['senado:'+id,name,full,uf,party,source||null]);
    count++;
  }
  await db.query("INSERT INTO sync_state(source_key,last_run_at,last_status,last_error) VALUES('senado-roster',now(),'ok',NULL) ON CONFLICT(source_key) DO UPDATE SET last_run_at=now(),last_status='ok',last_error=NULL,updated_at=now()");
  return res.json({status:'ok',count,source:URL,service_version:tag(xml,'VersaoServico')});
 }catch(e){return res.status(502).json({status:'error',source:URL,error:String(e.message||e)})}
}