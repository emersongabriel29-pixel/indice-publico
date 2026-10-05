# Metodologia v1.0 — Indicadores, métricas e critérios de avaliação

**Status:** proposta técnica para revisão antes do congelamento da versão 1.0.

Este documento transforma as oito dimensões da metodologia em indicadores objetivos, regras de cálculo e critérios de pontuação.

## 1. Regras gerais

### 1.1 Escala

Todos os indicadores normalizados produzem uma nota entre **0 e 100**.

A nota final é:

`Nota Final = Σ (Nota da dimensão × Peso da dimensão)`

Os pesos das oito dimensões somam 100%.

### 1.2 Regra de cobertura

Nenhum dado ausente será automaticamente tratado como zero.

Cada indicador terá:

- valor observado;
- período de referência;
- fonte;
- data de coleta;
- cobertura;
- confiança da fonte;
- nota calculada;
- versão da metodologia.

A **cobertura dos dados** será exibida separadamente da nota.

### 1.3 Mandatos parciais

Quando o político tiver exercido o cargo durante apenas parte do período analisado, os indicadores dependentes de tempo serão calculados somente sobre o período efetivamente exercido.

Quantidade absoluta nunca será comparada diretamente entre mandatos de duração diferente sem normalização.

### 1.4 Comparabilidade

A comparação principal será feita entre políticos do mesmo cargo e período metodologicamente compatível.

### 1.5 Ausência de dados

Se não houver dados suficientes para calcular um indicador, o sistema deverá marcar o indicador como **não calculável**, em vez de atribuir zero.

Quando uma dimensão não possuir cobertura mínima definida, a nota geral deverá mostrar a insuficiência de dados.

### 1.6 Dados corrigidos

Se uma fonte oficial corrigir um dado, o sistema preservará:

- valor anterior;
- valor corrigido;
- fonte;
- data da correção;
- motivo;
- versão do cálculo afetada.

---

# 2. Dimensão 1 — Participação e assiduidade — 15%

## Indicador 1.1 — Presença em sessões — 60% da dimensão

`Nota = 100 × (presenças / sessões previstas)`

Ausências oficialmente justificadas deverão ser tratadas conforme a classificação disponibilizada pela fonte oficial e não simplesmente somadas às ausências injustificadas.

Quando a fonte permitir separar categorias, o cálculo deverá documentar a regra aplicada.

## Indicador 1.2 — Participação em votações — 40% da dimensão

`Nota = 100 × (votações com registro / votações em que havia obrigação de participação)`

Serão considerados os registros oficiais de voto ou ausência.

A análise não atribui valor positivo ou negativo ao conteúdo do voto nesta dimensão.

## Nota da dimensão

`D1 = (I1.1 × 0,60) + (I1.2 × 0,40)`

---

# 3. Dimensão 2 — Atuação legislativa — 20%

Esta dimensão não premiará simplesmente quem apresentou mais proposições.

## Indicador 2.1 — Proposições com tramitação efetiva — 30%

Mede a proporção de proposições que ultrapassaram o estágio inicial de apresentação.

`Nota = 100 × proposições com tramitação efetiva / proposições elegíveis`

A definição de "tramitação efetiva" deverá ser vinculada a eventos oficiais da Câmara.

## Indicador 2.2 — Resultados legislativos — 35%

Mede proposições do parlamentar que alcançaram resultado legislativo verificável.

A classificação deverá considerar o estágio oficial alcançado, com tabela de pontuação publicada por tipo de proposição.

Exemplo de níveis:

- sem tramitação relevante: 0;
- tramitação relevante: 25;
- aprovação em etapa legislativa relevante: 60;
- resultado legislativo final verificável: 100.

Os valores definitivos deverão ser congelados antes do ranking de produção.

## Indicador 2.3 — Relatorias e atuação formal — 20%

Mede participação em relatorias e outras funções legislativas formalmente registradas.

A métrica deverá considerar atuação efetiva e não apenas quantidade bruta.

## Indicador 2.4 — Produção legislativa ajustada — 15%

Será utilizada quantidade de proposições por período efetivamente exercido, mas com **teto de influência** para impedir que volume bruto domine a dimensão.

`Produção ajustada = proposições elegíveis / meses de mandato × fator de qualidade`

O fator de qualidade será definido por eventos legislativos oficiais.

## Nota da dimensão

`D2 = (I2.1 × 0,30) + (I2.2 × 0,35) + (I2.3 × 0,20) + (I2.4 × 0,15)`

---

# 4. Dimensão 3 — Votações e posicionamentos documentados — 10%

Esta dimensão mede **consistência e transparência do registro de posicionamentos**, e não se o voto é politicamente "certo".

## Indicador 3.1 — Registro de voto — 50%

`Nota = 100 × votações com voto registrado / votações elegíveis`

SIM, NÃO, ABSTENÇÃO e outros estados oficiais serão preservados como dados distintos.

## Indicador 3.2 — Consistência documental — 30%

Mede a existência e consistência dos registros oficiais necessários para reconstruir a posição parlamentar.

## Indicador 3.3 — Explicabilidade do posicionamento — 20%

Quando houver manifestação oficial verificável relacionada à votação, ela poderá ser apresentada como contexto.

A existência de explicação **não significa que o voto receberá nota política maior**.

## Nota da dimensão

`D3 = (I3.1 × 0,50) + (I3.2 × 0,30) + (I3.3 × 0,20)`

---

# 5. Dimensão 4 — Uso de recursos públicos — 15%

A avaliação não utilizará simplesmente "gastou mais = pior".

## Indicador 4.1 — Regularidade documental — 30%

Mede a presença e consistência dos registros oficiais de despesas.

## Indicador 4.2 — Despesa relativa — 30%

A despesa será analisada em relação ao período e à disponibilidade aplicável.

`Despesa relativa = despesa elegível / recurso disponível no período`

A comparação deverá ocorrer entre parlamentares sujeitos a condições equivalentes.

## Indicador 4.3 — Anomalias estatísticas — 20%

Identifica valores excepcionalmente elevados em relação ao grupo comparável.

A anomalia será usada como indicador de atenção e não como prova de irregularidade.

## Indicador 4.4 — Justificabilidade documental — 20%

Verifica se as despesas possuem documentação e classificação compatíveis com os registros oficiais disponíveis.

## Regra importante

**Uma despesa acima da média não será automaticamente considerada irregular.**

## Nota da dimensão

`D4 = (I4.1 × 0,30) + (I4.2 × 0,30) + (I4.3 × 0,20) + (I4.4 × 0,20)`

---

# 6. Dimensão 5 — Transparência — 15%

## Indicador 5.1 — Completude documental — 35%

Percentual dos dados e documentos esperados que estão disponíveis.

`Nota = 100 × itens disponíveis / itens esperados`

## Indicador 5.2 — Atualização — 25%

Mede a disponibilidade dos registros dentro dos prazos esperados da fonte.

## Indicador 5.3 — Consistência entre fontes — 20%

Compara dados equivalentes entre bases oficiais.

## Indicador 5.4 — Auditabilidade — 20%

Mede se o cidadão consegue rastrear o dado apresentado até sua fonte.

## Nota da dimensão

`D5 = (I5.1 × 0,35) + (I5.2 × 0,25) + (I5.3 × 0,20) + (I5.4 × 0,20)`

---

# 7. Dimensão 6 — Compromissos verificáveis — 10%

Só serão avaliados compromissos que possam ser transformados em critérios verificáveis.

## Indicador 6.1 — Compromissos com meta mensurável — 20%

Percentual de compromissos que possuem objetivo ou resultado mensurável.

## Indicador 6.2 — Cumprimento — 50%

Para compromissos com meta e prazo:

`Cumprimento = resultado realizado / meta prevista`

O resultado será limitado a 100% para impedir que superar uma meta gere vantagem desproporcional.

## Indicador 6.3 — Evidência verificável — 20%

Avalia se existe evidência documental para sustentar o resultado informado.

## Indicador 6.4 — Cumprimento de prazo — 10%

Compara realização com o prazo declarado.

## Regra contra promessas vazias

Declarações genéricas sem meta, prazo ou evidência não devem receber a mesma pontuação de compromissos mensuráveis.

## Nota da dimensão

`D6 = (I6.1 × 0,20) + (I6.2 × 0,50) + (I6.3 × 0,20) + (I6.4 × 0,10)`

---

# 8. Dimensão 7 — Integridade documental/jurídica — 10%

Esta dimensão é deliberadamente diferente de uma "nota de caráter".

## Indicador 7.1 — Integridade documental — 40%

Mede consistência e completude dos registros oficiais consultados.

## Indicador 7.2 — Situação jurídica documentada — 40%

O sistema registrará estados jurídicos separadamente:

- investigação;
- acusação;
- processo;
- decisão;
- condenação;
- recurso;
- trânsito em julgado;
- absolvição;
- arquivamento.

**Não será permitido transformar automaticamente uma investigação em condenação.**

## Indicador 7.3 — Atualização e fonte — 20%

Mede se o registro possui fonte oficial, data e situação atualizada.

## Regra fundamental

O sistema não poderá afirmar que alguém "é criminoso", "é corrupto" ou equivalente apenas porque existe investigação ou processo.

A interface deverá apresentar o **status jurídico documentado**, a fonte e a data.

## Nota da dimensão

A fórmula final desta dimensão deverá aplicar uma tabela de estados jurídicos previamente publicada e juridicamente revisada. A tabela não será criada por julgamento subjetivo da IA.

---

# 9. Dimensão 8 — Prestação de contas eleitoral — 5%

## Indicador 8.1 — Completude — 35%

Percentual de informações esperadas disponibilizadas na prestação oficial.

## Indicador 8.2 — Consistência — 35%

Mede inconsistências identificáveis entre registros oficiais.

Uma inconsistência gera sinalização para revisão, não acusação automática de irregularidade.

## Indicador 8.3 — Situação da prestação — 30%

Considera a situação oficial registrada pelo TSE.

A classificação será baseada exclusivamente no status oficial disponível.

## Nota da dimensão

`D8 = (I8.1 × 0,35) + (I8.2 × 0,35) + (I8.3 × 0,30)`

---

# 10. Nota final

Com as oito dimensões:

`Nota Final = D1×0,15 + D2×0,20 + D3×0,10 + D4×0,15 + D5×0,15 + D6×0,10 + D7×0,10 + D8×0,05`

Resultado final: **0 a 100**.

## Faixas de apresentação

As faixas são apenas uma forma de apresentação e não devem substituir a nota numérica:

| Nota | Classificação |
|---:|---|
| 90–100 | Excelente |
| 80–89,99 | Muito bom |
| 70–79,99 | Bom |
| 60–69,99 | Regular |
| 50–59,99 | Baixo |
| 0–49,99 | Muito baixo |

As faixas poderão ser alteradas durante a revisão da metodologia sem alterar os dados históricos, desde que a mudança seja versionada.

---

# 11. Cobertura de dados

A plataforma deverá mostrar uma métrica independente:

`Cobertura = dados disponíveis e verificáveis / dados esperados`

A cobertura não altera automaticamente a nota.

Exemplo:

- Nota: 86/100
- Cobertura: 97%

é diferente de:

- Nota: 86/100
- Cobertura: 52%

O usuário deve conseguir identificar essa diferença.

---

# 12. Confiança da fonte

Cada informação deverá possuir classificação de fonte.

### Alta

Fonte oficial primária diretamente responsável pelo dado.

### Média

Fonte institucional confiável que reproduz ou agrega dados oficiais.

### Baixa

Fonte secundária utilizada apenas quando não houver fonte primária disponível ou para contextualização.

Fontes de baixa confiança não devem sustentar sozinhas indicadores críticos.

---

# 13. Regras contra manipulação do ranking

Os testes automatizados deverão verificar que:

1. Trocar a ordem dos políticos não muda as notas.
2. Trocar a ordem dos registros não muda as notas.
3. Alterar o partido não muda a nota quando partido não é variável do indicador.
4. Alterar o nome de exibição não muda a nota.
5. O resultado não depende do texto produzido por um LLM.
6. Dados idênticos produzem resultados idênticos.
7. Alterações na metodologia geram nova versão.
8. Alterações na fonte ficam registradas.

---

# 14. Regras para IA

A IA poderá:

- extrair dados;
- classificar documentos;
- normalizar campos;
- detectar possíveis inconsistências;
- produzir resumos;
- explicar cálculos.

A IA não poderá:

- escolher pesos;
- escolher vencedores;
- alterar notas manualmente;
- interpretar ideologia como mérito;
- transformar acusação em condenação;
- inventar informação ausente;
- substituir uma fonte oficial.

A pontuação final deverá ser produzida por código determinístico a partir de dados estruturados.

---

# 15. O que ainda precisa ser congelado antes da versão 1.0

Este documento fecha a estrutura das métricas, mas alguns parâmetros técnicos precisam de validação antes de serem considerados definitivos:

1. Tabela exata de pontuação dos estágios legislativos.
2. Tratamento matemático de ausências justificadas.
3. Definição final de "tramitação efetiva".
4. Método estatístico para anomalias de despesas.
5. Limites mínimos de cobertura.
6. Tabela objetiva de estados jurídicos.
7. Definição dos compromissos elegíveis.
8. Tratamento de mandatos muito curtos.
9. Método de normalização quando houver poucos comparáveis.
10. Regras para dados conflitantes entre fontes oficiais.

Esses parâmetros devem ser definidos em documentos de especificação antes do congelamento da metodologia.

---

# 16. Princípio final

**O Índice Público não deve dizer ao cidadão em quem votar.**

Ele deve permitir que o cidadão veja:

**o dado → a fonte → o indicador → a fórmula → o peso → a nota → a cobertura → a metodologia utilizada.**

A decisão política continua sendo do cidadão.
