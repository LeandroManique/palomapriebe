## Apps Script: Webhook para Google Sheets

1) Em uma planilha do Google, abra **Extensões > App Script** e cole o código abaixo em `Code.gs`.
2) Substitua `SHEET_NAME` pela aba de destino (ex.: `Leads`).
3) Clique em **Implantar > Nova implantação > Tipo: Aplicativo da web** e publique como acessível a "Qualquer pessoa com o link".
4) Copie a URL gerada e coloque em `SHEETS_WEBHOOK_URL` no `.env`.

```js
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Leads");
  const body = JSON.parse(e.postData.contents);
  const contact = body.contact || {};
  const answers = body.answers || {};
  const summary = body.summary || {};
  const meta = body.meta || {};

  const row = [
    new Date(),
    contact.name || "",
    contact.email || "",
    contact.phone || "",
    contact.plan || "",
    meta.source || "",
    meta.eta || "",
    body.riskFlag ? "SIM" : "NÃO",
    answers.goal || "",
    answers.history || "",
    answers.availability || "",
    answers.equipment || "",
    answers.effort || "",
    answers.recovery || "",
    answers.preferences || "",
    summary.systems || "",
    summary.intensity || "",
    summary.density || "",
    summary.volume || "",
    summary.technique || "",
  ];

  sheet.appendRow(row);

  return ContentService.createTextOutput(
    JSON.stringify({ status: "ok" }),
  ).setMimeType(ContentService.MimeType.JSON);
}
```

### Colunas sugeridas
- Timestamp | Nome | E-mail | WhatsApp | Plano | Fonte/UTM | SLA/ETA | Risco | Objetivo | Histórico/lesões | Disponibilidade | Equipamentos | Esforço | Sono/estresse | Preferências | Sistemas | Intensidade | Densidade | Volume mínimo | Técnica/checkpoints

### Notificações
- Adicione um gatilho (Executar: `doPost` via relógio) e use MailApp ou Webhooks para avisar a Paloma ao receber novas linhas.
