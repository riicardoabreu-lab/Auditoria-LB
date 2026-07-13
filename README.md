# Auditoria LB

Ferramenta de auditoria de campo de materiais usados em ordens de serviço do
cliente **Link Barato** (Infolink Telecom). Mostra cada OS/protocolo com os
materiais usados, localização no mapa e caixas de emenda (CEO), e permite que
a equipe de campo marque cada OS como "vistoriado", preencha a quantidade
auditada de cada material (comparando com a quantidade do sistema) e exporte
tudo em Excel.

Os dados de auditoria (quem vistoriou, quando, quantidades) ficam salvos numa
planilha Google compartilhada, sincronizados entre todo mundo da equipe.

## Colocar no ar (uma vez só)

### 1. Criar a planilha e publicar o backend

1. Crie uma planilha Google nova (ex: "Auditoria LB - Dados").
2. No menu, vá em **Extensões → Apps Script**.
3. Apague o conteúdo do arquivo `Code.gs` que abrir e cole o conteúdo de
   [`apps-script/Code.gs`](apps-script/Code.gs) deste repositório.
4. Clique em **Implantar → Nova implantação**.
5. Em "Selecionar tipo", escolha **Aplicativo da Web**.
6. Configure:
   - **Executar como:** Eu (sua conta Google)
   - **Quem pode acessar:** Qualquer pessoa
7. Clique em **Implantar**. Na primeira vez, o Google vai pedir pra você
   autorizar o script — aceite (é sua própria planilha).
8. Copie a **URL do Web App** (termina em `/exec`).

A aba `auditorias` é criada sozinha na planilha na primeira vez que alguém
salvar uma auditoria pelo site — não precisa criar as colunas manualmente.

### 2. Ligar o site à planilha

1. Abra o arquivo [`index.html`](index.html) deste repositório.
2. Procure a linha perto do topo do `<script>`:
   ```js
   const APPS_SCRIPT_URL = "COLE_AQUI";
   ```
3. Troque `"COLE_AQUI"` pela URL que você copiou no passo anterior.
4. Suba a alteração (`git add`, `commit`, `push`).

### 3. Acessar

Depois do push, a ferramenta fica disponível em:

```
https://riicardoabreu-lab.github.io/Auditoria-LB/
```

Qualquer pessoa da equipe com esse link pode abrir (celular ou computador),
vistoriar as OS e os dados ficam sincronizados na mesma planilha para todos.

## Estrutura

- `index.html` — a ferramenta (interface + lógica de sincronização).
- `apps-script/Code.gs` — código-fonte do backend (Google Apps Script), só
  para referência/versionamento — o que roda de verdade é a cópia colada no
  editor de Apps Script da sua planilha.

## Atualizando os dados das OS

O conteúdo de OS/materiais/caixas de emenda (`const DATA = {...}`, dentro do
`index.html`) é estático — reflete uma exportação feita em um momento
específico. Para atualizar com OS mais recentes, gere um novo relatório e
substitua esse bloco no `index.html` (as auditorias já registradas na
planilha continuam valendo, pois ficam por protocolo, não dependem do `DATA`).
