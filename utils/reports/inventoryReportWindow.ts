export function openInventoryReportWindow(data: any) {
  const win = window.open("", "_blank");

  win!.document.write(`
    <html>
    <head>
      <title>Relatório de Inventário</title>
      <style>
        @page { size: A4; margin: 20mm; }
        body { font-family: Arial; }
        .header { display:flex; justify-content:space-between; align-items:center; }
        img { height:80px }
        table { width:100%; border-collapse: collapse; margin-top:20px }
        th, td { border:1px solid #ddd; padding:8px; font-size:12px }
        th { background:#f3f3f3 }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <h2>${data.establishmentName}</h2>
          <p>${data.address}</p>
          <p>${data.phone}</p>
        </div>
        <img src="${data.logoUrl}" />
      </div>

      <h3>Relatório de Inventário</h3>
      <p>Gerado em: ${new Date(data.generatedAt).toLocaleString()}</p>

      <table>
        <thead>
          <tr>
            <th>Produto</th>
            <th>Categoria</th>
            <th>Quantidade</th>
            <th>Controlado</th>
          </tr>
        </thead>
        <tbody>
          ${data.products
            .map(
              (p: any) => `
            <tr>
              <td>${p.productName}</td>
              <td>${p.categoryName}</td>
              <td>${p.stockQuantity}</td>
              <td>${p.stockControlled ? "Sim" : "Não"}</td>
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