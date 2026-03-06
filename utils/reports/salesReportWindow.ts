export function openSalesReportWindow(data: any) {
  // Só roda no cliente
  if (typeof window === "undefined") return;

  const win = window.open("", "_blank");
  if (!win) return;

  win.document.write(`
    <html>
    <head>
      <title>Relatório de Vendas</title>
      <style>
        @page { size: A4; margin: 20mm; }
        body { font-family: Arial, sans-serif; margin:0; padding:0; }
        .container { width: 90%; margin: auto; }
        .header { text-align: center; margin-bottom: 20px; }
        .header img { max-height: 100px; margin-bottom: 10px; }
        h2 { margin: 0; font-size: 24px; }
        p.info { margin: 5px 0; font-size: 14px; color: #555; }
        h3 { text-align: center; margin-top: 30px; font-size: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 13px; }
        th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
        th { background-color: #f0f0f0; }
        tbody tr:nth-child(even) { background-color: #fafafa; }
        .footer { text-align: center; font-size: 11px; color: #888; position: fixed; bottom: 10px; width: 100%; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          ${data.logoUrl ? `<img src="${data.logoUrl}" alt="Logo">` : ""}
          <h2>${data.establishmentName}</h2>
          <p class="info">${data.address} | ${data.phone}</p>
        </div>

        <h3>Relatório de Vendas</h3>
        <p style="text-align:center; margin-top:5px; font-size:14px;">
          Período: ${new Date(data.startDate).toLocaleDateString()} - ${new Date(data.endDate).toLocaleDateString()}
        </p>

        <table>
          <tr><th>Total Vendas</th><td>${data.totalSales}</td></tr>
          <tr><th>Total Cancelado</th><td>${data.totalCancelled}</td></tr>
          <tr><th>Total Líquido</th><td>${data.netTotal}</td></tr>
          <tr><th>Total Transações</th><td>${data.totalTransactions}</td></tr>
          <tr><th>Ticket Médio</th><td>${data.averageTicket}</td></tr>
        </table>

        <h4 style="margin-top:30px;">Pagamentos</h4>
        <table>
          <thead>
            <tr>
              <th>Método</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${data.payments
              .map(
                (p: any) => `
                <tr>
                  <td>${p.paymentMethodName}</td>
                  <td>${p.total}</td>
                </tr>
              `
              )
              .join("")}
          </tbody>
        </table>
      </div>

      <div class="footer">
        Processado por SGC – Sistema de Gestão Comercial, Mozambique
      </div>
    </body>
    </html>
  `);

  win.document.close();
  win.focus();
}