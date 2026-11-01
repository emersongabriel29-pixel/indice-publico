export const access='public'; export const methods=['GET'];
export default async function(req,res){
 const url='https://www12.senado.leg.br/dados-abertos/legislativo/parlamentares/senadores-em-exercicio';
 try{
  const r=await fetch(url);const text=await r.text();
  return res.json({source:url,status:'catalog_available',message:'O catálogo oficial do Senado está disponível. A ingestão estruturada será feita pelo job de sincronização.',bytes:text.length});
 }catch(e){return res.status(502).json({error:'Fonte Senado indisponível',source:url});}
}