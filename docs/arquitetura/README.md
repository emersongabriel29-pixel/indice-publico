# Arquitetura

O sistema será separado em coleta, armazenamento, processamento, cálculo e apresentação.

## Fluxo

Fonte oficial → ingestão → normalização → validação → armazenamento → cálculo determinístico → API → interface.

A IA pode atuar em etapas controladas, mas não deve substituir a fonte oficial nem alterar diretamente a pontuação sem uma regra determinística documentada.

## Stack proposta

- Frontend: React + TypeScript + Vite + Tailwind
- Backend: Node.js + TypeScript + Fastify
- Banco: PostgreSQL
- ORM: Drizzle
- Jobs: workers Node.js / cron
- Cache: Redis
- API: REST + OpenAPI
- Infraestrutura: Docker
- CI/CD: GitHub Actions
- IA: pipeline com LLM e validações estruturadas

## Regra de separação

A coleta não decide a pontuação.

A IA não inventa fatos.

A apresentação não altera o resultado calculado.
