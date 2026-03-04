export function openSalesReportWindow(data: any) {
  const win = window.open("", "_blank");

  win!.document.write(`
    <html>
    <head>
      <title>Relatório de Vendas</title>
      <style>
        @page { size: A4; margin: 20mm; }
        body { font-family: Arial; }
        table { width:100%; border-collapse: collapse; margin-top:20px }
        th, td { border:1px solid #ddd; padding:8px; font-size:12px }
        th { background:#f3f3f3 }
      </style>
    </head>
    <body>
      <h2>${data.establishmentName}</h2>
      <p>${data.address} | ${data.phone}</p>

      <h3>Relatório de Vendas</h3>
      <p>Período: ${new Date(
        data.startDate
      ).toLocaleDateString()} - ${new Date(
    data.endDate
  ).toLocaleDateString()}</p>

      <table>
        <tr><th>Total Vendas</th><td>${data.totalSales}</td></tr>
        <tr><th>Total Cancelado</th><td>${data.totalCancelled}</td></tr>
        <tr><th>Total Líquido</th><td>${data.netTotal}</td></tr>
        <tr><th>Total Transações</th><td>${data.totalTransactions}</td></tr>
        <tr><th>Ticket Médio</th><td>${data.averageTicket}</td></tr>
      </table>

      <h4>Pagamentos</h4>
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
    </body>
    </html>
  `);

  win!.document.close();
  win!.focus();
}