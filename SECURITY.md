# Segurança

Dúvida ou falha de segurança: avise o dono em particular, nunca em issue pública.

## Diretrizes de revisão

Valem para o Codex e para o Claude. Os invariantes completos estão no `AGENTS.md`.

- Dinheiro: o servidor calcula o valor; inteiro em centavos; repetir a chamada nunca cobra ou
  entrega duas vezes. 
- Isolamento: toda linha de negócio pertence a um dono/tenant; consulta ou rota sem esse filtro é
  falha.
- Segredo: segredo de terceiro cifrado e fora de log e resposta; nada de chave privada ou token no
  código.
- Entrada: validar toda entrada de usuário, de webhook e de API; checar permissão em toda rota.
