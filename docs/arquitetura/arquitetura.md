# Arquitetura do Índice Público

## Objetivo

A arquitetura separa coleta, normalização, validação, cálculo, publicação e auditoria. Nenhuma camada de apresentação deve alterar o resultado calculado.

## Camadas

1. **Fontes oficiais**
   - Câmara dos Deputados
   - Senado Federal
   - Tribunal Superior Eleitoral
   - Tribunais de Contas e portais oficiais
   - Portais de transparência
   - Outros órgãos oficiais conforme o cargo e o indicador

2. **Ingestão**
   - coleta periódica;
   - armazenamento do dado bruto;
   - registro de URL, instituição, data/hora de coleta e versão da fonte;
   - hash do documento quando aplicável.

3. **Normalização**
   - identificação única do político;
   - padronização de datas, valores, categorias e situações;
   - associação ao cargo, mandato e período;
   - preservação do valor original.

4. **Validação**
   - consistência estrutural;
   - duplicidades;
   - campos obrigatórios;
   - compatibilidade de período;
   - conferência com a fonte oficial;
   - estados de disponibilidade: observed_zero, missing, not_applicable, pending_validation e unverified.

5. **Motor de cálculo**
   - recebe somente dados validados;
   - aplica a versão explícita da metodologia;
   - gera resultados determinísticos;
   - registra hashes de entrada e metodologia.

6. **Publicação**
   - perfis;
   - histórico anual;
   - indicadores;
   - contexto partidário estatístico;
   - fontes;
   - trilha de auditoria;
   - API pública.

## Regra de determinismo

A mesma combinação de:

`dados + período + cargo + versão da metodologia`

deve produzir o mesmo resultado.

A ordem de políticos, partido, nome exibido ou posição no ranking não pode alterar o cálculo.

## Separação entre dado e interpretação

A aplicação deve exibir o dado observado antes da pontuação. O usuário deve conseguir navegar de:

resultado → dimensão → indicador → valor bruto → normalização → fórmula → peso → fonte.

## Comparabilidade

A chave mínima de comparação é:

`office + period_id + methodology_version`

Não comparar diretamente cargos diferentes.

## Histórico

Resultados publicados são imutáveis. Correções geram nova versão, preservando o registro anterior e o motivo da alteração.

## Segurança e governança

- credenciais fora do código;
- logs de ingestão e cálculo;
- controle de acesso para alterações;
- validação antes da publicação;
- backups;
- monitoramento de falhas;
- revisão de metodologia versionada.

## Frontend

O frontend consome resultados calculados pela API. Fórmulas e regras críticas não devem depender de lógica exclusiva do navegador.

## Status de implementação

A documentação define a arquitetura. A implementação completa exige banco persistente, pipelines de ingestão, motor de cálculo, API, testes e interface conectados.
