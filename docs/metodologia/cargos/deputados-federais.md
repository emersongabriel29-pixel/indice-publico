# Metodologia por cargo — Deputados Federais

**Status:** especificação técnica em revisão.

## Escopo

A análise de deputados federais será baseada em dados oficiais da Câmara dos Deputados e, quando pertinente, TSE e outras fontes públicas. A API da Câmara disponibiliza dados de deputados, despesas, proposições, tramitações, votações e votos nominais. citeturn0search3

## Modelo de indicadores

| Eixo | Peso técnico |
|---|---:|
| Participação e assiduidade | 15% |
| Atuação legislativa | 25% |
| Votações documentadas | 15% |
| Uso de recursos parlamentares | 15% |
| Transparência | 15% |
| Compromissos verificáveis | 10% |
| Prestação de contas eleitoral | 5% |

Os pesos são parâmetros da metodologia e devem ser versionados.

## Fórmula

Cada indicador recebe uma medida normalizada de 0 a 100 quando houver dados suficientes.

`Índice descritivo = Σ(indicador normalizado × peso)`

### 1. Participação
`P = 0,60 × presença + 0,40 × participação_em_votações`

### 2. Atuação legislativa
`L = 0,30 × tramitação + 0,35 × resultados_legislativos + 0,20 × relatorias/comissões + 0,15 × produção_ajustada`

### 3. Votações
`V = 0,50 × registros_de_voto + 0,30 × completude_do_registro + 0,20 × documentação_do_posicionamento`

A fórmula não atribui valor político a SIM ou NÃO.

### 4. Recursos
`R = 0,30 × regularidade + 0,30 × despesa_relativa + 0,20 × análise_de_anomalias + 0,20 × documentação`

Anomalia estatística é sinal de revisão, não prova de irregularidade. A Câmara mantém dados históricos de despesas da cota parlamentar. citeturn0search9

### 5. Transparência
`T = 0,35 × completude + 0,25 × atualização + 0,20 × consistência + 0,20 × auditabilidade`

### 6. Compromissos
`C = 0,20 × mensurabilidade + 0,50 × execução + 0,20 × evidência + 0,10 × prazo`

### 7. Prestação eleitoral
`E = 0,35 × completude + 0,35 × consistência + 0,30 × situação_oficial`

O TSE disponibiliza conjuntos de dados de prestação de contas eleitorais. citeturn0search0

## Regra de cobertura

`Cobertura = dados verificáveis disponíveis / dados esperados`

Nenhum dado ausente será convertido automaticamente em zero.

## Comparação

Deputados serão comparados somente com outros deputados e em períodos compatíveis. A metodologia não utilizará partido, ideologia, popularidade ou preferência política como variável de cálculo.
