export const access="public"; export const methods=["GET"];
export default async function(req,res){
 const source={name:"Dados Abertos da Câmara",url:"https://dadosabertos.camara.leg.br/",retrieved_at:new Date().toISOString()};
 try{
  const all=[];let page=1;
  while(true){
   const r=await fetch("https://dadosabertos.camara.leg.br/api/v2/deputados?ordem=ASC&ordenarPor=nome&itens=100&pagina="+page,{headers:{Accept:"application/json"}});
   if(!r.ok)return res.status(502).json({error:"Fonte Câmara indisponível",source});
   const data=await r.json();all.push(...(data.dados||[]));
   if(!(data.links||[]).some(x=>x.rel==="next"))break;
   if(++page>10)throw new Error("pagination guard exceeded");
  }
  const deputies=all.map(d=>({id:d.id,nome:d.nome,uri:d.uri,siglaPartido:d.siglaPartido,siglaUf:d.siglaUf,imagem:d.urlFoto,source_url:d.uri}));
  res.json({source,count:deputies.length,deputies});
 }catch(e){res.status(502).json({error:"Falha ao consultar fonte oficial",source});}
}