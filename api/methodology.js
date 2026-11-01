export const access="public"; export const methods=["GET"];
const dimensions=[
 ["Participação e assiduidade",15],["Atuação legislativa",20],["Votações e posicionamentos documentados",10],
 ["Uso de recursos públicos",15],["Transparência",15],["Compromissos verificáveis",10],
 ["Integridade documental/jurídica",10],["Prestação de contas eleitoral",5]
];
export default async function(req,res){res.json({version:"1.0",status:"proposta",dimensions,rule:"mesma entrada + mesma metodologia = mesmo cálculo"});}