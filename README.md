# Auditoria LB

Ferramenta de auditoria de campo de materiais usados em ordens de serviço do
cliente **Link Barato** (Infolink Telecom). Mostra cada OS/protocolo com os
materiais usados, localização no mapa e caixas de emenda (CEO), e permite que
a equipe de campo marque cada OS como "vistoriado", preencha a quantidade
auditada de cada material (comparando com a quantidade do sistema) e exporte
tudo em Excel.

Os dados de auditoria (quem vistoriou, quando, quantidades) ficam salvos no
Firestore (mesmo projeto Firebase usado no ISP Manage e no Aquisições do
[ultraexpansao](https://github.com/riicardoabreu-lab/ultraexpansao)) e
sincronizam **em tempo real** entre todo mundo da equipe — sem precisar
recarregar a página.

## Acesso

```
https://riicardoabreu-lab.github.io/Auditoria-LB/
```

Login exigido: usa o mesmo login do portal ultraexpansao (mesma conta/senha
do ISP Manage). Quem não estiver logado é redirecionado automaticamente para
o portal.

Não precisa configurar nada — diferente de ferramentas baseadas em Google
Sheets, aqui o backend já vem pronto (mesmo Firebase do resto do site).

⚠️ **Importante:** pra sincronização funcionar, as regras de segurança do
Firestore (Firebase Console, projeto `isp-manager-ce`) precisam permitir
leitura/escrita autenticada na coleção `auditoria_lb`. Se aparecer "não foi
possível sincronizar" mesmo logado, é provavelmente isso.

## Estrutura

- `index.html` — a ferramenta (interface + lógica de sincronização em tempo
  real via Firestore, no `<script type="module">` do `<head>`).

## Atualizando os dados das OS

O conteúdo de OS/materiais/caixas de emenda (`const DATA = {...}`, dentro do
`index.html`) é estático — reflete uma exportação feita em um momento
específico. Para atualizar com OS mais recentes, gere um novo relatório e
substitua esse bloco no `index.html` (as auditorias já registradas no
Firestore continuam valendo, pois ficam por protocolo, não dependem do
`DATA`).
