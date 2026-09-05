// utils/inventoryReportGenerator.ts
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface InventoryItem {
    id: number;
    productName: string;
    categoryName: string;
    stockQuantity: number;
    stockControlled: boolean;
}

interface InventoryReportData {
    establishmentName: string;
    establishmentId: string;
    establishmentAddress?: string;
    establishmentPhone?: string;
    logoUrl?: string;
    generatedAt: string;
    totalProducts: number;
    totalStockControlledProducts: number;
    totalStockQuantity: number;
    items: InventoryItem[];
}

/**
 * Gera um PDF simples com a lista de inventários
 * Sem cores personalizadas - apenas preto e branco com linhas
 */
export function generateInventoryReportPDF(
    data: InventoryReportData,
    logoBase64?: string
): string {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // ============================================================
    // 1. CABEÇALHO
    // ============================================================

    // Logo (se disponível)
    if (logoBase64) {
        try {
            doc.addImage(logoBase64, "JPEG", pageWidth / 2 - 25, 10, 50, 20);
        } catch (e) {
            // Se não conseguir carregar a imagem, continua sem logo
        }
    }

    // Nome do estabelecimento - centralizado
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text(data.establishmentName || "Sistema", pageWidth / 2, logoBase64 ? 38 : 20, { align: "center" });

    // Endereço
    if (data.establishmentAddress) {
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(80, 80, 80);
        doc.text(data.establishmentAddress, pageWidth / 2, logoBase64 ? 44 : 28, { align: "center" });
    }

    // Telefone
    if (data.establishmentPhone) {
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(80, 80, 80);
        doc.text(`Tel: ${data.establishmentPhone}`, pageWidth / 2, (data.establishmentAddress ? 50 : 34), { align: "center" });
    }

    // Data de geração
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(120, 120, 120);
    const generatedDate = data.generatedAt 
        ? new Date(data.generatedAt).toLocaleString("pt-MZ", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          })
        : new Date().toLocaleString("pt-MZ");
    doc.text(`Gerado em: ${generatedDate}`, pageWidth / 2, (data.establishmentPhone ? 56 : 40), { align: "center" });

    // Linha separadora
    const startY = data.establishmentPhone ? 62 : 46;
    doc.setDrawColor(180, 180, 180);
    doc.setLineWidth(0.5);
    doc.line(20, startY, pageWidth - 20, startY);

    // ============================================================
    // 2. TÍTULO DO RELATÓRIO
    // ============================================================

    let yOffset = startY + 10;
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("Relatório de Inventário", pageWidth / 2, yOffset, { align: "center" });
    yOffset += 8;

    // ============================================================
    // 3. RESUMO (cards simples em texto)
    // ============================================================

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);

    const summaryText = [
        `Total de Produtos: ${data.totalProducts || 0}`,
        `Produtos com Controle de Stock: ${data.totalStockControlledProducts || 0}`,
        `Quantidade Total em Stock: ${(data.totalStockQuantity || 0).toFixed(2)}`
    ].join("  |  ");

    doc.text(summaryText, pageWidth / 2, yOffset + 4, { align: "center" });
    yOffset += 10;

    // Linha separadora
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(20, yOffset, pageWidth - 20, yOffset);
    yOffset += 8;

    // ============================================================
    // 4. TABELA DE PRODUTOS
    // ============================================================

    if (data.items && data.items.length > 0) {
        const tableData = data.items.map((item) => [
            item.id.toString(),                                    // ID numérico sequencial
            item.productName,
            item.categoryName || "-",
            item.stockQuantity.toFixed(2),
            item.stockControlled ? "Sim" : "Não"
        ]);

        autoTable(doc, {
            startY: yOffset,
            head: [["#", "Produto", "Categoria", "Quantidade", "Controlado"]],
            body: tableData,
            theme: "plain",  // Sem cores, apenas linhas
            styles: {
                fontSize: 8,
                cellPadding: 3,
                textColor: [0, 0, 0],
                lineColor: [180, 180, 180],
                lineWidth: 0.1,
            },
            headStyles: {
                fillColor: [240, 240, 240],
                textColor: [0, 0, 0],
                fontStyle: "bold",
                fontSize: 8,
                lineColor: [180, 180, 180],
                lineWidth: 0.2,
            },
            columnStyles: {
                0: { cellWidth: 15, halign: "center" },
                1: { cellWidth: 70 },
                2: { cellWidth: 45 },
                3: { cellWidth: 30, halign: "right" },
                4: { cellWidth: 30, halign: "center" },
            },
            margin: { left: 20, right: 20 },
            tableWidth: "auto",
        });

        yOffset = (doc as any).lastAutoTable?.finalY + 8 || yOffset + 40;

        // ============================================================
        // 5. TOTALIZADOR
        // ============================================================

        if (yOffset < pageHeight - 30) {
            doc.setDrawColor(180, 180, 180);
            doc.setLineWidth(0.5);
            doc.line(20, yOffset, pageWidth - 20, yOffset);
            yOffset += 8;

            doc.setFontSize(10);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(0, 0, 0);
            doc.text(
                `Total de Itens: ${data.items.length}`,
                pageWidth - 20,
                yOffset,
                { align: "right" }
            );
            yOffset += 6;

            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(80, 80, 80);
            doc.text(
                `Quantidade Total em Stock: ${(data.totalStockQuantity || 0).toFixed(2)}`,
                pageWidth - 20,
                yOffset,
                { align: "right" }
            );
        }

    } else {
        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(120, 120, 120);
        doc.text("Nenhum produto encontrado no inventário.", pageWidth / 2, yOffset + 20, { align: "center" });
    }

    // ============================================================
    // 6. RODAPÉ
    // ============================================================

    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(7);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(150, 150, 150);
        doc.text(
            `SGC - Sistema de Gestão Comercial | ${data.establishmentName || "Sistema"}`,
            pageWidth / 2,
            pageHeight - 8,
            { align: "center" }
        );
        doc.text(
            `Página ${i}/${pageCount}`,
            pageWidth - 14,
            pageHeight - 8,
            { align: "right" }
        );
    }

    return doc.output("datauristring");
}