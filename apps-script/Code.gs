/**
 * Backend da Auditoria de Materiais — Link Barato (Infolink Telecom)
 *
 * Como publicar:
 * 1. Crie uma planilha Google nova (pode chamar "Auditoria LB - Dados").
 * 2. Extensões > Apps Script.
 * 3. Apague o conteúdo do arquivo Code.gs e cole todo este arquivo.
 * 4. Implantar > Nova implantação > tipo "Aplicativo da Web".
 *    - Executar como: Eu (sua conta)
 *    - Quem pode acessar: Qualquer pessoa
 * 5. Autorize o script quando pedido, copie a URL do Web App (termina em /exec)
 *    e cole na constante APPS_SCRIPT_URL no início do index.html.
 *
 * A aba "auditorias" é criada automaticamente na primeira chamada, com as
 * colunas: protocolo | status | auditor | data_vistoria | itens_auditados | atualizado_em
 */

const SHEET_NAME = 'auditorias';
const HEADERS = ['protocolo', 'status', 'auditor', 'data_vistoria', 'itens_auditados', 'atualizado_em'];

function doGet(e) {
  const sheet = getSheet_();
  const rows = sheet.getDataRange().getValues();
  rows.shift(); // remove o cabeçalho
  const auditorias = rows
    .filter(r => r[0] !== '' && r[0] !== null)
    .map(r => ({
      protocolo: r[0],
      status: r[1],
      auditor: r[2],
      data_vistoria: r[3],
      itens_auditados: r[4],
      atualizado_em: r[5],
    }));
  return jsonResponse_({ ok: true, auditorias: auditorias });
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    if (data.protocolo === undefined || data.protocolo === null || data.protocolo === '') {
      return jsonResponse_({ ok: false, error: 'protocolo ausente' });
    }
    const sheet = getSheet_();
    const rows = sheet.getDataRange().getValues();
    let rowIndex = -1;
    for (let i = 1; i < rows.length; i++) {
      if (String(rows[i][0]) === String(data.protocolo)) { rowIndex = i + 1; break; }
    }
    const newRow = [
      data.protocolo,
      data.status || '',
      data.auditor || '',
      data.data_vistoria || '',
      data.itens_auditados || '{}',
      new Date().toISOString(),
    ];
    if (rowIndex === -1) {
      sheet.appendRow(newRow);
    } else {
      sheet.getRange(rowIndex, 1, 1, newRow.length).setValues([newRow]);
    }
    return jsonResponse_({ ok: true });
  } catch (err) {
    return jsonResponse_({ ok: false, error: String(err) });
  }
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
  }
  return sheet;
}

function jsonResponse_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
