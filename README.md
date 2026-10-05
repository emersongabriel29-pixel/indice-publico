# Índice Público

**Política analisada por dados, não por torcida.**

O Índice Público é uma plataforma de análise de desempenho e transparência de agentes políticos baseada em dados públicos, metodologia versionada e critérios auditáveis.

> **A IA não decide quem é melhor. A IA processa dados.**

## Escopo de implementação

1. **Deputados Federais**
2. **Senadores**
3. **Governadores**
4. **Presidente da República**

A metodologia será adaptada a cada cargo quando suas atribuições, fontes ou dados forem diferentes.

## Perfil do político

Cada político terá um perfil com identificação, avaliação por ano, histórico anual, indicadores, cobertura, atuação política, recursos públicos, histórico eleitoral, registros jurídicos, compromissos, linha do tempo, fontes e auditoria.

O perfil não será apenas uma nota: cada resultado deverá permitir rastrear o caminho até o dado e a fonte original.

## Histórico por ano

O ano é uma dimensão estrutural, não apenas um filtro visual.

A plataforma deverá permitir consultar **2026 → 2025 → 2024 → ...**. Cada resultado preservará período, cargo, mandato/legislatura, metodologia, cobertura, dados, fontes e cálculo.

**O passado não será recalculado silenciosamente com a metodologia atual.**

## Contexto partidário

O perfil poderá apresentar, separadamente da avaliação individual:
- média dos integrantes comparáveis do partido no período;
- quantidade considerada;
- cobertura média;
- decisões e orientações institucionais documentadas;
- histórico dessas decisões.

A atuação individual e a atuação institucional do partido permanecerão separadas.

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
- Resultados históricos não são sobrescritos silenciosamente.
- Comparações respeitam cargo, período, cobertura e metodologia.

## Fontes prioritárias

- Câmara dos Deputados
- Senado Federal
- Tribunal Superior Eleitoral
- Outras fontes públicas oficiais pertinentes a cada cargo

## Estrutura

Fonte oficial → coleta → normalização → validação → armazenamento → cálculo determinístico → API → interface → auditoria
