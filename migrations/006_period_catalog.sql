INSERT INTO periods(type,reference_year,start_date,end_date,office,methodology_version)
SELECT 'year',y,make_date(y,1,1),make_date(y,12,31),o,'1.0'
FROM generate_series(2022,2026) y CROSS JOIN (VALUES
('Deputados Federais'),('Senadores'),('Governadores'),('Presidente')
) v(o)
WHERE NOT EXISTS (
 SELECT 1 FROM periods p WHERE p.type='year' AND p.reference_year=y AND p.office=o AND p.methodology_version='1.0'
);
INSERT INTO sources(institution,url,source_type,reliability)
SELECT 'Câmara dos Deputados','https://dadosabertos.camara.leg.br/','api','primary'
WHERE NOT EXISTS(SELECT 1 FROM sources WHERE institution='Câmara dos Deputados');
INSERT INTO sources(institution,url,source_type,reliability)
SELECT 'Senado Federal','https://www12.senado.leg.br/dados-abertos','catalog','primary'
WHERE NOT EXISTS(SELECT 1 FROM sources WHERE institution='Senado Federal');
INSERT INTO sources(institution,url,source_type,reliability)
SELECT 'Tribunal Superior Eleitoral','https://dadosabertos.tse.jus.br/','dataset','primary'
WHERE NOT EXISTS(SELECT 1 FROM sources WHERE institution='Tribunal Superior Eleitoral');