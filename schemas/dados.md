# Modelo de dados

Tempo, cargo, mandato e versão metodológica são dimensões estruturais.

## politicians
- id
- name
- ballot_name
- cpf_hash
- office
- state
- party
- status

## mandates
- id
- politician_id
- office
- start_date
- end_date
- legislature_id
- state
- source_id

## periods
- id
- type: year | mandate | legislature | election
- reference_year
- start_date
- end_date
- office
- mandate_id
- methodology_version

## sources
- id
- institution
- url
- source_type
- collected_at
- reliability
- source_version
- document_hash

## events
- id
- politician_id
- event_type
- date
- period_id
- source_id

## votes
- id
- politician_id
- proposition_id
- vote
- date
- period_id
- source_id

## propositions
- id
- type
- number
- year
- subject
- status
- source_id

## expenses
- id
- politician_id
- category
- amount
- date
- period_id
- source_id

## electoral_accounts
- id
- politician_id
- election
- revenue
- expenditure
- period_id
- source_id

## assets
- id
- politician_id
- election
- declared_value
- period_id
- source_id

## commitments
- id
- politician_id
- commitment
- target
- deadline
- achieved
- status
- evidence_source
- period_id

## legal_records
- id
- politician_id
- case
- status
- court
- date
- period_id
- source_id

## party_events
- id
- party_id
- event_type
- date
- period_id
- description
- source_id

## party_membership
- id
- politician_id
- party_id
- start_date
- end_date
- period_id
- source_id

## party_aggregates
- id
- party_id
- office
- period_id
- members_count
- mean_score
- mean_coverage
- methodology_version
- calculated_at

A média considera apenas integrantes elegíveis e comparáveis.

## score_snapshots
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

## scores
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

## score_revisions
- id
- score_snapshot_id
- previous_snapshot_id
- reason
- changed_at
- source_id
- change_type

## Estados de disponibilidade

- observed_zero — zero efetivamente observado;
- missing — informação ausente;
- not_applicable — não aplicável;
- pending_validation — aguardando validação;
- unverified — encontrado, mas não validado.

Ausência de dado nunca deve ser interpretada automaticamente como desempenho zero.

## Integridade histórica

Nenhum resultado histórico deve ser sobrescrito silenciosamente. Correções de fonte devem gerar nova versão e manter a relação com o resultado anterior.

## Comparabilidade

A chave lógica considera pelo menos:

**office + period_id + methodology_version**

Comparações entre versões só ocorrem quando explicitamente autorizadas e documentadas.
