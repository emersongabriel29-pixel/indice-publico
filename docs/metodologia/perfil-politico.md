# Perfil do político

## Objetivo
Página individual do Índice Público, reunindo identificação, desempenho por período, histórico, atuação política, recursos públicos, histórico eleitoral, registros jurídicos, compromissos, linha do tempo e auditoria.

O perfil não é apenas uma nota: cada resultado deve permitir rastrear o caminho até o dado e a fonte original.

## Estrutura

1. **Identificação**
   - foto oficial, nome completo e nome político;
   - cargo, estado e partido;
   - mandato e período;
   - situação atual;
   - identificadores e fontes oficiais.

2. **Avaliação do período**
   - filtro de ano/período;
   - resultado, quando houver metodologia aplicável;
   - cobertura dos dados;
   - metodologia utilizada;
   - dimensões e indicadores;
   - data do cálculo.

3. **Histórico anual**
   - consulta de 2026, 2025, 2024 e demais anos disponíveis;
   - cada ano preserva período, cargo, mandato/legislatura, metodologia, fontes, cobertura e resultado;
   - mudança metodológica não sobrescreve silenciosamente o passado.

4. **Indicadores**
   
   Detalhamento obrigatório:
   
   **Resultado → dimensão → indicador → dado bruto → normalização → fórmula → peso → pontos → fonte.**

5. **Contexto partidário**
   - média dos integrantes comparáveis do partido;
   - quantidade considerada;
   - cobertura média;
   - cargo e período;
   - decisões e orientações institucionais documentadas;
   - histórico dessas decisões.
   
   A atuação individual e a atuação institucional do partido permanecem separadas.

6. **Atuação política**
   - proposições e projetos;
   - relatorias;
   - votações;
   - comissões;
   - discursos e manifestações oficiais;
   - atos e resultados documentados, conforme o cargo.
   
   Quantidade bruta não equivale automaticamente a qualidade.

7. **Recursos públicos**
   - despesas;
   - categorias;
   - valores;
   - documentos;
   - evolução histórica;
   - contexto de comparação.

8. **Histórico eleitoral**
   - eleições;
   - votos;
   - resultados;
   - bens;
   - receitas e despesas;
   - prestação de contas;
   - fontes oficiais.

9. **Registros jurídicos e de integridade**
   - investigação, acusação, processo, decisão, recurso, condenação, absolvição, arquivamento e trânsito em julgado, conforme documentado.
   
   Investigação ou acusação nunca deve ser apresentada como condenação.

10. **Compromissos verificáveis**
    - compromisso, meta, indicador, prazo, progresso, situação, evidência e fonte.
    - estados: não iniciado, em andamento, concluído, atrasado, não verificável ou cancelado quando documentado.

11. **Linha do tempo**
    - eventos públicos verificáveis com data, categoria, período e fonte.

12. **Dados insuficientes**
    
    Ausência de informação não significa zero.
    
    Mensagem padrão:
    
    > **Dados insuficientes para avaliação neste indicador.**
    
    Exibir também cobertura e dados esperados que não foram encontrados ou validados.

13. **Auditoria**
    
    Todo resultado deve permitir seguir:
    
    **Resultado → dimensão → indicador → dado bruto → fórmula → peso → fonte → documento original.**
    
    Informar fonte, órgão, URL, data de coleta, período, confiabilidade, metodologia e cálculo.

14. **Imutabilidade histórica**
    
    Correções posteriores devem preservar o registro anterior, registrar a nova versão, motivo e eventual novo cálculo. Nunca sobrescrever silenciosamente o histórico.

15. **Neutralidade**
    
    Não utilizar como variável de mérito popularidade, seguidores, aparência, carisma, torcida política, preferência do usuário, rumores ou acusações não verificadas. Ideologia pode ser descrita quando documentada, mas não funciona como variável oculta de mérito.

16. **API**
    
    A API deve expor identificação, mandato, período, partido, indicadores, resultados, histórico, fontes, cobertura, metodologia e contexto partidário. A lógica final de cálculo não deve ficar no frontend.

17. **Comparabilidade**
    
    Comparações devem respeitar cargo, período, metodologia, cobertura mínima e regras de normalização. Cargos diferentes não devem ser comparados pela mesma fórmula sem modelo específico.

## Ordem visual sugerida

Identificação → Ano/período → Resultado e cobertura → Indicadores → Evolução histórica → Contexto partidário → Atuação política → Recursos públicos → Histórico eleitoral → Registros jurídicos → Compromissos → Linha do tempo → Fontes e auditoria.
