export const METHODOLOGY_VERSION="1.1";
export const WEIGHTS={
 "Deputados Federais":{participacao:.15,legislativa:.25,votacoes:.15,recursos:.15,transparencia:.15,compromissos:.10,eleitoral:.05},
 "Senadores":{participacao:.15,legislativa:.25,votacoes:.15,comissoes:.10,recursos:.15,transparencia:.10,eleitoral:.10},
 "Governadores":{orcamento:.20,metas:.20,servicos:.20,fiscal:.15,contratos:.10,transparencia:.10,eleitoral:.05},
 "Presidente":{orcamento:.20,metas:.20,resultados:.25,fiscal:.15,contratos:.05,transparencia:.10,eleitoral:.05}
};
export const COMPONENTS={
 "Deputados Federais":{
  participacao:{presence:.60,voting_participation:.40},legislativa:{tramitation:.30,results:.35,committees:.20,production:.15},
  votacoes:{registered_votes:.50,completeness:.30,documentation:.20},recursos:{regularity:.30,relative_expense:.30,anomalies:.20,documentation:.20},
  transparencia:{completeness:.35,updated:.25,consistency:.20,auditability:.20},compromissos:{measurability:.20,execution:.50,evidence:.20,deadline:.10},
  eleitoral:{completeness:.35,consistency:.35,official_status:.30}},
 "Senadores":{participacao:{presence:.60,voting_participation:.40},legislativa:{tramitation:.35,results:.30,production:.20,institutional:.15},
  votacoes:{registered_votes:.60,documentation:.40},comissoes:{formal_participation:.60,reporting_results:.40},
  recursos:{regularity:.40,relative_expense:.30,documentation:.30},transparencia:{completeness:.40,updated:.30,auditability:.30},
  eleitoral:{completeness:.40,consistency:.30,official_status:.30}}
};
export function clamp(v){return Math.max(0,Math.min(100,Number(v)))}
export function weighted(values,weights){
 let total=0,available=0;
 for(const [k,w] of Object.entries(weights)){
  total+=w;
  const raw=values?.[k];
  if(raw===null||raw===undefined||raw==="") continue;
  const v=Number(raw);
  if(!Number.isFinite(v)) continue;
  available+=w;
 }
 let score=0;
 for(const [k,w] of Object.entries(weights)){
  const raw=values?.[k];
  if(raw===null||raw===undefined||raw==="") continue;
  const v=Number(raw);
  if(Number.isFinite(v)) score+=clamp(v)*w;
 }
 return {score:available?score/available:null,coverage:total?available/total:0};
}
export function calculate(office,values){if(!WEIGHTS[office])throw new Error("Cargo não suportado");return weighted(values,WEIGHTS[office])}
export function dimension(values,weights){return weighted(values,weights)}