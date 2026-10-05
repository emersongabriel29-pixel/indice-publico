# Metodologia por cargo — Senadores

**Status:** especificação técnica em revisão.

## Modelo de indicadores

| Eixo | Peso técnico |
|---|---:|
| Participação e assiduidade | 15% |
| Atuação legislativa | 25% |
| Votações documentadas | 15% |
| Comissões e relatorias | 10% |
| Uso de recursos públicos | 15% |
| Transparência | 10% |
| Prestação de contas eleitoral | 10% |

## Fórmula

`Índice descritivo = Σ(indicador normalizado × peso)`

### Participação
`P = 0,60 × presença + 0,40 × participação_em_votações`

### Atuação legislativa
`L = 0,35 × tramitação + 0,30 × resultados + 0,20 × produção_ajustada + 0,15 × atuação_institucional`

### Votações
`V = 0,60 × votos_registrados + 0,40 × completude_documental`

A fórmula registra o comportamento parlamentar, sem considerar o conteúdo ideológico do voto como mérito.

### Comissões e relatorias
`C = 0,60 × participação_formal + 0,40 × relatorias_com_resultado_documentado`

### Recursos
`R = 0,40 × regularidade + 0,30 × despesa_relativa + 0,30 × documentação`

### Transparência
`T = 0,40 × completude + 0,30 × atualização + 0,30 × auditabilidade`

### Prestação eleitoral
`E = 0,40 × completude + 0,30 × consistência + 0,30 × situação_oficial`

Os dados eleitorais e de prestação de contas devem ser obtidos prioritariamente do TSE. citeturn0search0

## Regras

- Comparação somente entre senadores.
- Mandatos e períodos devem ser normalizados.
- Ausência de informação não equivale a zero.
- Partido e ideologia não entram como variável.
- Toda medida deve possuir fonte e data de coleta.
