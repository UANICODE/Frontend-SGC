// utils/reports/stockReportGenerator.ts
import { InventoryReportResponse } from "@/types/admin/report.types";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface ReportOptions {
    establishmentName: string;
    primaryColor: string;
    secondaryColor: string;
}

function hexToRgb(hex: string): [number, number, number] {
    const cleanHex = hex.replace("#", "");
    const bigint = parseInt(cleanHex, 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

function formatCurrency(value: number): string {
    if (value === null || value === undefined) return "-";
    return value.toFixed(2) + " MT";
}

function formatDate(dateStr: string): string {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("pt-MZ", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}

export function generateStockPDF(
    data: InventoryReportResponse,
    options: ReportOptions
): string {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const primaryRGB = hexToRgb(options.primaryColor || "#4F46E5");
    const secondaryRGB = hexToRgb(options.secondaryColor || "#7C3AED");

    // ============================================================
    // HEADER
    // ============================================================

    doc.setFontSize(22);
    doc.setTextColor(primaryRGB[0], primaryRGB[1], primaryRGB[2]);
    doc.setFont("helvetica", "bold");
    doc.text("Relatório de Stock", pageWidth / 2, 20, { align: "center" });

    doc.setFontSize(12);
    doc.setTextColor(secondaryRGB[0], secondaryRGB[1], secondaryRGB[2]);
    doc.setFont("helvetica", "normal");
    

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`${options.establishmentName}`, pageWidth / 2, 38, { align: "center" });
    doc.text(`Data: ${formatDate(data.generatedAt)}`, pageWidth / 2, 44, { align: "center" });

    doc.setDrawColor(primaryRGB[0], primaryRGB[1], primaryRGB[2]);
    doc.setLineWidth(0.5);
    doc.line(20, 48, pageWidth - 20, 48);

    let yOffset = 58;

    // ============================================================
    // CARDS DE RESUMO
    // ============================================================

    const cards = [
        { label: "Total de Produtos", value: data.totalProducts?.toString() || "0" },
        { label: "Produtos com Stock", value: data.totalStockControlledProducts?.toString() || "0" },
        { label: "Stock Total", value: data.totalStockQuantity?.toFixed(2) || "0.00" },
    ];

    const cardWidth = (pageWidth - 42) / cards.length;
    const cardHeight = 20;

    cards.forEach((card, index) => {
        const x = 14 + index * (cardWidth + 7);
        const bgRGB: [number, number, number] = [
            Math.round(255 * 0.92 + primaryRGB[0] * 0.08),
            Math.round(255 * 0.92 + primaryRGB[1] * 0.08),
            Math.round(255 * 0.92 + primaryRGB[2] * 0.08),
        ];
        doc.setFillColor(bgRGB[0], bgRGB[1], bgRGB[2]);
        doc.rect(x, yOffset, cardWidth, cardHeight, "F");
        doc.setDrawColor(primaryRGB[0], primaryRGB[1], primaryRGB[2]);
        doc.setLineWidth(0.3);
        doc.rect(x, yOffset, cardWidth, cardHeight, "D");
        doc.setFontSize(7);
        doc.setTextColor(100, 100, 100);
        doc.setFont("helvetica", "normal");
        doc.text(card.label, x + 4, yOffset + 7);
        doc.setFontSize(10);
        doc.setTextColor(primaryRGB[0], primaryRGB[1], primaryRGB[2]);
        doc.setFont("helvetica", "bold");
        doc.text(card.value, x + 4, yOffset + 16);
    });

    yOffset += 30;

    // ============================================================
    // TABELA DE PRODUTOS
    // ============================================================

    const tableData = data.products.map((item) => {
        // 🔥 FORMATAR INGREDIENTES: Nome, Quantidade Usada, Stock do Ingrediente
        let ingredientsText = "-";
        if (item.ingredients && item.ingredients.length > 0) {
            ingredientsText = item.ingredients
                .map((i) => {
                    const qtdUsada = i.quantityUsedPerProduct || 0;
                    const stockIngrediente = i.ingredientStockQuantity || 0;
                    return `${i.ingredientName} (${qtdUsada} usada / ${stockIngrediente} stock)`;
                })
                .join("; ");
        }

        return [
            item.name || "-",                                // Produto
            item.category || "-",                            // Categoria
            formatCurrency(item.salePrice || 0),             // Preço Venda
            formatCurrency(item.purchasePrice || 0),         // Preço Compra
            item.stockQuantity?.toFixed(2) || "0.00",        // Quantidade
            ingredientsText,                                 // Ingredientes (formatado)
        ];
    });

    autoTable(doc, {
        startY: yOffset,
        head: [
            ["Produto", "Categoria", "Preço Venda", "Preço Compra", "Quantidade", "Ingredientes"]
        ],
        body: tableData,
        theme: "striped",
        headStyles: {
            fillColor: [primaryRGB[0], primaryRGB[1], primaryRGB[2]],
            textColor: [255, 255, 255],
            fontStyle: "bold",
            fontSize: 8,
        },
        styles: { fontSize: 7 },
        columnStyles: {
            0: { cellWidth: 30 },
            1: { cellWidth: 20 },
            2: { cellWidth: 22, halign: "right" },
            3: { cellWidth: 22, halign: "right" },
            4: { cellWidth: 18, halign: "center" },
            5: { cellWidth: 55 },
        },
        margin: { left: 14, right: 14 },
        didDrawPage: (data) => {
            const pageNumber = doc.getNumberOfPages();
            doc.setFontSize(7);
            doc.setTextColor(150, 150, 150);
            doc.setFont("helvetica", "italic");
            doc.text(
                `SGC - Sistema de Gestão Comercial | www.uanicode.com ${new Date().toLocaleString("pt-MZ")}`,
                pageWidth / 2,
                pageHeight - 8,
                { align: "center" }
            );
            doc.text(`Pagina ${pageNumber}`, pageWidth - 14, pageHeight - 8, { align: "right" });
        },
    });

    return doc.output("datauristring");
}