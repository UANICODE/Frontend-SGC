export function openInventoryReportWindow(data: any) {
  if (typeof window === "undefined") return;

  const win = window.open("", "_blank");
  if (!win) return;

  win.document.write(`
    <html>
    <head>
      <title>Relatório de Inventário</title>
      <style>
        @page { size: A4; margin: 20mm; }
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
        .container { width: 90%; margin: auto; }
        .header { text-align: center; margin-bottom: 20px; }
        .header img { max-height: 100px; margin-bottom: 10px; }
        h2 { margin: 0; font-size: 24px; }
        p.info { margin: 5px 0; font-size: 14px; color: #555; }
        h3 { text-align: center; margin-top: 30px; font-size: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 13px; }
        th, td { border: 1px solid #ccc; padding: 8px; text-align: left; vertical-align: top; }
        th { background-color: #f0f0f0; }
        tbody tr:nth-child(even) { background-color: #fafafa; }
        .footer { text-align: center; font-size: 11px; color: #888; position: fixed; bottom: 10px; width: 100%; }
        ul { margin: 0; padding-left: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          ${data.logoUrl ? `<img src="${data.logoUrl}" alt="Logo">` : ""}
          <h2>${data.establishmentName}</h2>
          <p class="info">${data.address} | ${data.phone}</p>
        </div>

        <h3>Relatório de Inventário</h3>
        <p style="text-align:center; margin-top:5px; font-size:14px;">
          Gerado em: ${new Date(data.generatedAt).toLocaleString()}
        </p>

        <table>
          <thead>
            <tr>
              <th>Produto</th>
              <th>Categoria</th>
              <th>Preço</th>
              <th>Quantidade</th>
              <th>Controlado</th>
              <th>Ingredientes</th>
            </tr>
          </thead>
          <tbody>
            ${data.products
              .map((p: any) => {
                const ingredients = p.ingredients && p.ingredients.length
                  ? `<ul>${p.ingredients.map((i: any) => `<li>${i.ingredientName} (Usado: ${i.quantityUsedPerProduct}, Estoque: ${i.ingredientStock})</li>`).join("")}</ul>`
                  : "-";
                return `
                  <tr>
                    <td>${p.name}</td>
                    <td>${p.category}</td>
                    <td>${p.price.toFixed(2)} MZN</td>
                    <td>${p.stockQuantity}</td>
                    <td>${p.controlsStock ? "Sim" : "Não"}</td>
                    <td>${ingredients}</td>
                  </tr>
                `;
              })
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