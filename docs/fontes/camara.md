# Fonte oficial — Câmara dos Deputados

## Finalidade

A Câmara dos Deputados é fonte primária para dados relativos à atuação de deputados federais e proposições sob sua competência.

## Dados a coletar

Conforme disponibilidade oficial e pertinência metodológica:

- identificação parlamentar;
- partido e UF;
- mandato;
- presença;
- sessões e votações;
- registros de voto;
- proposições;
- autoria;
- relatorias;
- comissões;
- despesas e cotas;
- informações oficiais associadas ao mandato.

## Regras

1. Priorizar API e páginas oficiais.
2. Armazenar a resposta bruta antes da normalização.
3. Registrar data/hora da coleta.
4. Associar cada registro ao período correto.
5. Não transformar ausência de registro em zero sem regra explícita.
6. Em caso de divergência, preservar os valores das fontes e registrar a validação.

## Identificação

O identificador oficial do parlamentar deve ser preservado. O nome exibido pela aplicação não é chave primária.

## Auditoria

Cada indicador calculado deve apontar para o registro de origem e para a URL/documento oficial correspondente.

## Uso no Índice Público

Os dados da Câmara alimentam os indicadores aplicáveis a deputados federais e, quando pertinente, outras relações institucionais documentadas. Não devem ser usados para inferir atributos não presentes na fonte.
