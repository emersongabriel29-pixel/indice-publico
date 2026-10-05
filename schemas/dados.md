# Modelo de dados

Modelo inicial proposto:

## politicians

id, name, ballot_name, cpf_hash, office, state, party, status

## mandates

politician_id, office, start_date, end_date

## sources

id, institution, url, source_type, collected_at, reliability

## events

politician_id, event_type, date, source_id

## votes

politician_id, proposition_id, vote, date, source_id

## propositions

id, type, number, year, subject, status, source_id

## expenses

politician_id, category, amount, date, source_id

## electoral_accounts

politician_id, election, revenue, expenditure, source_id

## assets

politician_id, election, declared_value, source_id

## commitments

politician_id, commitment, target, deadline, achieved, evidence_source

## legal_records

politician_id, case, status, court, date, source_id

## scores

politician_id, methodology_version, criterion, raw_value, normalized_value, points, calculated_at

O modelo poderá evoluir conforme os indicadores forem formalizados.
