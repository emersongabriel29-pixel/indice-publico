# Índice Público

**Política analisada por dados, não por torcida.**

O Índice Público é uma plataforma de análise de desempenho e transparência de agentes políticos baseada em dados públicos, metodologia versionada e critérios auditáveis.

> **A IA não decide quem é melhor. A IA processa dados.**

## Escopo de implementação

A expansão do projeto seguirá esta ordem:

1. **Deputados Federais**
2. **Senadores**
3. **Governadores**
4. **Presidente da República**

A metodologia será adaptada a cada cargo quando suas atribuições, fontes ou dados forem diferentes. Uma fórmula criada para o Legislativo não será aplicada automaticamente ao Executivo.

### Fase 1 — Deputados Federais

Primeiro grupo de comparação e validação da metodologia, priorizando dados estruturados e oficiais da Câmara dos Deputados.

### Fase 2 — Senadores

Depois da validação com deputados federais, incorporação do Senado Federal e adaptação dos indicadores às atribuições específicas do cargo.

### Fase 3 — Governadores

Adaptação para o Poder Executivo estadual, com indicadores compatíveis com gestão, orçamento, transparência, contratos e resultados verificáveis.

### Fase 4 — Presidente da República

Adaptação para o Poder Executivo federal, considerando suas atribuições e fontes oficiais próprias.

## Metodologia

A proposta v1.0 possui oito dimensões:

| Dimensão | Peso |
|---|---:|
| Participação e assiduidade | 15% |
| Atuação legislativa | 20% |
| Votações e posicionamentos documentados | 10% |
| Uso de recursos públicos | 15% |
| Transparência | 15% |
| Compromissos verificáveis | 10% |
| Integridade documental/jurídica | 10% |
| Prestação de contas eleitoral | 5% |

Os pesos acima são uma **proposta metodológica** até o congelamento da versão correspondente.

A metodologia detalhada está em [docs/metodologia/v1.0.md](docs/metodologia/v1.0.md) e os indicadores em [docs/metodologia/indicadores-v1.0.md](docs/metodologia/indicadores-v1.0.md).

## Princípios

- Dados oficiais e verificáveis como base.
- Metodologia pública e versionada.
- Cálculos determinísticos.
- Rastreabilidade até a fonte original.
- Dados ausentes não viram automaticamente zero.
- Fatos, interpretações e opiniões permanecem separados.
- Ideologia não é variável de mérito.
- A IA auxilia a operação; não decide a avaliação.
- Alterações metodológicas ficam registradas historicamente.

## Fontes prioritárias

- Câmara dos Deputados
- Senado Federal
- Tribunal Superior Eleitoral
- Outras fontes públicas oficiais pertinentes a cada cargo

## Estrutura planejada

`Fonte oficial → coleta → normalização → validação → armazenamento → cálculo determinístico → API → interface → auditoria`
