# Auditoria LB

Ferramenta de auditoria de campo de materiais usados em ordens de serviço do
cliente **Link Barato** (Infolink Telecom). Mostra cada OS/protocolo com os
materiais usados, localização no mapa e caixas de emenda (CEO), e permite que
a equipe de campo:

- marque cada OS como "vistoriado" (com nome do auditor e data);
- preencha a quantidade auditada de cada material, comparando com a
  quantidade do sistema;
- anexe **fotos** da vistoria (aba "Fotos" em cada protocolo);
- registre **observações/comentários** em texto livre (aba "Obs");
- exporte tudo em Excel.

Os dados de auditoria (quem vistoriou, quando, quantidades, fotos,
observações) ficam salvos no Firestore (mesmo projeto Firebase usado no ISP
Manage e no Aquisições do
[ultraexpansao](https://github.com/riicardoabreu-lab/ultraexpansao)) e
sincronizam **em tempo real** entre todo mundo da equipe — sem precisar
recarregar a página.

## Acesso

```
https://riicardoabreu-lab.github.io/Auditoria-LB/
```

Login exigido — **conta própria da equipe de campo** (diferente do login do
portal ultraexpansao, de propósito: quem audita não precisa ver CFO, ISP
Manage ou Aquisições). A conta é criada manualmente no Firebase Console
(Authentication → Users → Add user).

O mesmo conjunto de dados também pode ser visto (e editado) por quem tem o
login do portal, em `ultraexpansao/auditoria-lb/` — é a mesma ferramenta, só
que atrás do login normal do portal.

⚠️ **Importante:** pra sincronização funcionar, as regras de segurança do
Firestore (Firebase Console, projeto `isp-manager-ce`) precisam permitir
leitura/escrita autenticada na coleção `auditoria_lb`. Se aparecer "não foi
possível sincronizar" mesmo logado, é provavelmente isso.

## Fotos — sem Firebase Storage

O projeto está no plano gratuito do Firebase (Spark), que não inclui Cloud
Storage (isso exigiria migrar para o plano pago Blaze). Por isso, as fotos:

- são redimensionadas e comprimidas no navegador (JPEG, até 1000px no maior
  lado) antes de salvar;
- ficam guardadas como base64 dentro do próprio documento da auditoria no
  Firestore (não em arquivos separados).

Isso tem um limite: cada protocolo tem um teto de ~900KB de fotos (dá pra
guardar algumas fotos por OS, não um álbum inteiro). Se o limite for
atingido, a ferramenta avisa e pede pra remover fotos antigas antes de
adicionar novas. Se no futuro isso virar um problema recorrente, migrar para
o plano Blaze (que tem cota gratuita própria de Storage) resolve.

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
