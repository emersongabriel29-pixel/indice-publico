# Princípios de Auditoria

## 1. Rastreabilidade

Todo resultado deve ser rastreável até os dados brutos e à fonte oficial.

## 2. Reprodutibilidade

Com os mesmos dados e a mesma versão metodológica, o cálculo deve ser reproduzível.

## 3. Imutabilidade histórica

Não sobrescrever silenciosamente resultados publicados.

## 4. Versionamento

Registrar:

- metodologia;
- fonte;
- período;
- cálculo;
- revisão;
- data de publicação.

## 5. Disponibilidade dos dados

Distinguir:

- `observed_zero`: zero efetivamente observado;
- `missing`: dado esperado não localizado;
- `not_applicable`: indicador não aplicável;
- `pending_validation`: encontrado, mas ainda não validado;
- `unverified`: informação sem validação suficiente.

## 6. Cobertura

A aplicação deve mostrar a cobertura dos dados utilizados. Cobertura baixa não deve ser escondida.

## 7. Correções

Uma correção deve registrar:

- valor anterior;
- novo valor;
- fonte;
- motivo;
- data;
- cálculo afetado;
- nova versão do resultado, quando aplicável.

## 8. Neutralidade operacional

O sistema não utiliza popularidade, seguidores, aparência, carisma, torcida partidária, rumores ou acusações não verificadas como variáveis de mérito.

Ideologia pode ser apresentada descritivamente quando houver base documental, sem convertê-la automaticamente em pontuação.

## 9. Auditoria de cálculo

A trilha mínima é:

resultado → dimensão → indicador → dado bruto → normalização → fórmula → peso → fonte.

## 10. Integridade

Alterações de nome, ordem, partido exibido ou posição na interface não podem modificar dados históricos ou fórmulas.
