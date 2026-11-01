INSERT INTO periods(type,reference_year,start_date,end_date,office,mandate_id,methodology_version)
SELECT 'year',2026,'2026-01-01','2026-12-31',office,mandate_id,'1.1'
FROM periods
WHERE type='year' AND reference_year=2026 AND methodology_version='1.0'
ON CONFLICT(type,reference_year,office,methodology_version) DO NOTHING;