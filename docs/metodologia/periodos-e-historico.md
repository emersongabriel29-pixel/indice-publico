# Períodos, filtro anual e histórico

## Princípio

O tempo é uma dimensão estrutural do Índice Público. O histórico não é um arquivo secundário e não deve ser recalculado silenciosamente com a metodologia atual.

Todo dado, indicador, cálculo e resultado possui período de referência.

## Filtro anual

A interface deve oferecer um filtro principal:

**Ano: 2026 ▾**

Os anos disponíveis dependem dos dados existentes e verificáveis.

O filtro afeta perfil, indicadores, resultados, contexto partidário, decisões institucionais, despesas, votações, compromissos, registros eleitorais, linha do tempo, fontes e cobertura.

## Período e cargo

O ano não substitui o mandato. O sistema combina:
- ano de referência;
- cargo;
- mandato;
- legislatura, quando aplicável;
- estado, quando aplicável.

Exemplos:
- Deputado Federal → ano + mandato/legislatura;
- Senador → ano + mandato;
- Governador → ano + mandato;
- Presidente → ano + mandato.

## Histórico

Cada político possui uma visão de evolução:

**2026 → 2025 → 2024 → ...**

Cada ano preserva a metodologia vigente naquele período.

| Ano | Metodologia |
|---|---|
| 2024 | v1.0 |
| 2025 | v1.0 |
| 2026 | v1.1 |

O exemplo é ilustrativo; a versão real vem do registro publicado.

## Regra contra recálculo retroativo

Quando a metodologia mudar:
1. criar nova versão;
2. registrar vigência;
3. identificar períodos afetados;
4. definir formalmente eventual recálculo;
5. preservar o resultado anterior;
6. explicar o novo resultado;
7. manter a ligação entre versões.

## Correção de dados históricos

Se uma fonte oficial corrigir informação anterior, preservar:
- valor anterior;
- valor corrigido;
- fonte;
- datas;
- motivo;
- cálculo afetado;
- resultado anterior;
- resultado posterior, se houver recálculo autorizado.

## Modelo conceitual

### periods
- id
- type: year | mandate | legislature | election
- reference_year
- start_date
- end_date
- office
- mandate_id
- methodology_version

### score_snapshots
- id
- politician_id
- office
- period_id
- reference_year
- methodology_version
- final_score
- coverage
- calculated_at
- input_hash
- methodology_hash

### scores
- id
- politician_id
- office
- period_id
- reference_year
- methodology_version
- criterion
- raw_value
- normalized_value
- points
- calculated_at
- source_snapshot_id
- calculation_hash

## Determinismo histórico

A mesma combinação de dados de entrada, período, cargo, metodologia e parâmetros deve produzir o mesmo resultado.

Alterações em qualquer componente devem ser identificáveis.

## Dados ausentes

Distinguir:
- zero observado;
- dado ausente;
- não aplicável;
- ainda não coletado;
- não validado.

Ausência nunca vira automaticamente zero.

## Regra de publicação

Nenhum resultado histórico deve ser publicado sem período de referência, cargo, metodologia, cobertura, fontes e data do cálculo.
