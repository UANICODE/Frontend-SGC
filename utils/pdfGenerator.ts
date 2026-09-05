// utils/pdfGenerator.ts
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
    AssetsReportItem,
    InventoriesReportItem,
    CostsReportItem,
    PurchaseReportResponse,
} from "@/types/admin/report";
import { ExportDataResponse, MonthlyExpenseGroup } from "@/types/admin/cost";
import { InventoryReportResponse } from "@/types/admin/report.types";

// ============================================================
// TIPOS
// ============================================================

interface PdfReportOptions {
    title: string;
    subtitle: string;
    establishmentName: string;
    primaryColor: string;
    secondaryColor: string;
    periodStart?: string;
    periodEnd?: string;
}

interface StockReportOptions {
    establishmentName: string;
    primaryColor: string;
    secondaryColor: string;
}

// ============================================================
// CONSTANTES
// ============================================================

const MONTHS = [
    "Janeiro",
    "Fevereiro",
    "Marco",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
];

// ============================================================
// UTILITÁRIOS PUROS
// ============================================================

function hexToRgb(hex: string): [number, number, number] {
    const cleanHex = hex.replace("#", "");
    const bigint = parseInt(cleanHex, 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

function formatCurrency(value: number): string {
    return value.toFixed(2) + " MT";
}

function formatDate(dateStr: string): string {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

function groupByMonth<T>(data: T[], getDate: (item: T) => string): Record<string, T[]> {
    return data.reduce((acc, item) => {
        const dateStr = getDate(item);
        if (!dateStr) return acc;
        const date = new Date(dateStr);
        const year = date.getFullYear();
        const month = date.getMonth();
        const key = `${MONTHS[month]} de ${year}`;
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
    }, {} as Record<string, T[]>);
}

// ============================================================
// COMPONENTES DE PDF (Reutilizáveis)
// ============================================================

function addReportHeader(
    doc: jsPDF,
    title: string,
    subtitle: string | null,
    establishmentName: string,
    primaryRGB: [number, number, number],
    secondaryRGB: [number, number, number],
    periodStart?: string,
    periodEnd?: string
): void {
    const pageWidth = doc.internal.pageSize.getWidth();

    // Título
    doc.setFontSize(22);
    doc.setTextColor(primaryRGB[0], primaryRGB[1], primaryRGB[2]);
    doc.setFont("helvetica", "bold");
    doc.text(title, pageWidth / 2, 20, { align: "center" });

    // Subtítulo
    if (subtitle) {
        doc.setFontSize(12);
        doc.setTextColor(secondaryRGB[0], secondaryRGB[1], secondaryRGB[2]);
        doc.setFont("helvetica", "normal");
        doc.text(subtitle, pageWidth / 2, 30, { align: "center" });
    }

    // Estabelecimento
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`${establishmentName}`, pageWidth / 2, 38, { align: "center" });

    // Período
    if (periodStart && periodEnd) {
        doc.text(`Periodo: ${formatDate(periodStart)} - ${formatDate(periodEnd)}`, pageWidth / 2, 44, { align: "center" });
    }

    // Linha separadora
    doc.setDrawColor(primaryRGB[0], primaryRGB[1], primaryRGB[2]);
    doc.setLineWidth(0.5);
    doc.line(20, 48, pageWidth - 20, 48);
}

function addSummaryCards(
    doc: jsPDF,
    yOffset: number,
    cards: { label: string; value: string }[],
    primaryRGB: [number, number, number]
): number {
    const pageWidth = doc.internal.pageSize.getWidth();
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

    return yOffset + cardHeight + 10;
}

function addFooter(doc: jsPDF, establishmentName: string, pageNumber: number): void {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.setFont("helvetica", "italic");
    doc.text(
     "SGC- Sistema de Gestao Comercial || www.uanicode.com || Mozambique",
        pageWidth / 2,
        pageHeight - 8,
        { align: "center" }
    );
    doc.text(`Pagina ${pageNumber}`, pageWidth - 14, pageHeight - 8, { align: "right" });
}

function createTable(
    doc: jsPDF,
    yOffset: number,
    head: string[],
    body: any[][],
    primaryRGB: [number, number, number],
    // use string keys and loose typing to match jspdf-autotable's expected shape
    columnStyles: Record<string, any>
): number {
    autoTable(doc, {
        startY: yOffset,
        head: [head],
        body: body,
        theme: "striped",
        headStyles: {
            fillColor: [primaryRGB[0], primaryRGB[1], primaryRGB[2]],
            textColor: [255, 255, 255],
            fontStyle: "bold",
            fontSize: 8,
        },
        styles: { fontSize: 7 },
        columnStyles: columnStyles,
        margin: { left: 14, right: 14 },
    });

    return (doc as any).lastAutoTable?.finalY + 8 || yOffset + 40;
}

function addTotalCard(
    doc: jsPDF,
    yOffset: number,
    label: string,
    value: number,
    primaryRGB: [number, number, number],
    pageWidth: number
): number {
    const totalX = 14;
    const totalWidth = pageWidth - 28;
    const totalHeight = 25;

    doc.setFillColor(primaryRGB[0], primaryRGB[1], primaryRGB[2]);
    doc.roundedRect(totalX, yOffset, totalWidth, totalHeight, 4, 4, "F");

    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text(label, totalX + 12, yOffset + 10);

    doc.setFontSize(16);
    doc.text(formatCurrency(value), totalX + totalWidth - 12, yOffset + 10, { align: "right" });

    return yOffset + totalHeight + 12;
}

// ============================================================
// GERADORES DE RELATÓRIOS
// ============================================================

export function generateAssetsPDF(data: AssetsReportItem[], options: PdfReportOptions): string {
    const doc = new jsPDF("p", "mm", "a4");
    const primaryRGB = hexToRgb(options.primaryColor || "#4F46E5");
    const secondaryRGB = hexToRgb(options.secondaryColor || "#7C3AED");

    addReportHeader(
        doc,
        options.title,
        options.subtitle,
        options.establishmentName,
        primaryRGB,
        secondaryRGB,
        options.periodStart,
        options.periodEnd
    );

    let yOffset = 58;

    yOffset = addSummaryCards(doc, yOffset, [
        { label: "Total Ativos", value: data.length.toString() },
        {
            label: "Valor Total",
            value: formatCurrency(data.reduce((sum, a) => sum + a.purchaseValue, 0)),
        },
    ], primaryRGB);

    const tableData = data.map((item) => [
        item.code,
        item.name,
        item.category || "-",
        item.quantity.toString(),
        formatCurrency(item.purchaseValue),
        item.location || "-",
        item.status,
    ]);

    yOffset = createTable(
        doc,
        yOffset,
        ["Codigo", "Nome", "Categoria", "Qtd", "Valor", "Localizacao", "Status"],
        tableData,
        primaryRGB,
        {
            0: { cellWidth: 25 },
            1: { cellWidth: 35 },
            2: { cellWidth: 25 },
            3: { cellWidth: 15, halign: "center" },
            4: { cellWidth: 30, halign: "right" },
            5: { cellWidth: 30 },
            6: { cellWidth: 25, halign: "center" },
        }
    );

    addFooter(doc, options.establishmentName, doc.getNumberOfPages());
    return doc.output("datauristring");
}

export function generateInventoriesPDF(data: InventoriesReportItem[], options: PdfReportOptions): string {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const primaryRGB = hexToRgb(options.primaryColor || "#4F46E5");
    const secondaryRGB = hexToRgb(options.secondaryColor || "#7C3AED");

    addReportHeader(
        doc,
        options.title,
        options.subtitle,
        options.establishmentName,
        primaryRGB,
        secondaryRGB,
        options.periodStart,
        options.periodEnd
    );

    let yOffset = 58;
    const groupedByMonth = groupByMonth(data, (item) => item.startDate);
    let inventoryCounter = 0;

    for (const [monthLabel, inventories] of Object.entries(groupedByMonth)) {
        if (yOffset > 230) {
            doc.addPage();
            yOffset = 20;
        }

        // Título do mês
        doc.setFontSize(14);
        doc.setTextColor(primaryRGB[0], primaryRGB[1], primaryRGB[2]);
        doc.setFont("helvetica", "bold");
        doc.text(`📅 ${monthLabel}`, 14, yOffset);
        yOffset += 8;

        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.setFont("helvetica", "normal");
        doc.text(`${inventories.length} inventarios encontrados`, 14, yOffset);
        yOffset += 6;

        for (const inventory of inventories) {
            inventoryCounter++;

            if (yOffset > 230) {
                doc.addPage();
                yOffset = 20;
            }

            // Cabeçalho do inventário
            doc.setFontSize(11);
            doc.setTextColor(primaryRGB[0], primaryRGB[1], primaryRGB[2]);
            doc.setFont("helvetica", "bold");
            doc.text(`Inventario #${inventoryCounter}`, 14, yOffset);
            yOffset += 6;

            doc.setFontSize(9);
            doc.setTextColor(0, 0, 0);
            doc.setFont("helvetica", "bold");
            doc.text(`Tipo: ${inventory.typeName}`, 14, yOffset);
            yOffset += 5;

            doc.setFontSize(8);
            doc.setTextColor(80, 80, 80);
            doc.setFont("helvetica", "normal");
            doc.text(`Responsavel: ${inventory.responsibleUserName || "N/A"}`, 14, yOffset);
            yOffset += 4;
            doc.text(`Inicio: ${formatDate(inventory.startDate)}`, 14, yOffset);
            yOffset += 4;
            if (inventory.endDate) {
                doc.text(`Fim: ${formatDate(inventory.endDate)}`, 14, yOffset);
                yOffset += 4;
            }

            if (inventory.items.length > 0) {
                const itemData = inventory.items.map((item) => [
                    item.itemName,
                    item.itemType,
                    item.expectedQuantity?.toString() || "0",
                    item.countedQuantity?.toString() || "0",
                    item.difference !== 0
                        ? (item.difference > 0 ? `-${Math.abs(item.difference)}` : `+${Math.abs(item.difference)}`)
                        : "0",
                    item.lossType || "-",
                ]);

                yOffset = createTable(
                    doc,
                    yOffset,
                    ["Item", "Tipo", "Esperado", "Encontrado", "Diferenca", "Justificativa"],
                    itemData,
                    primaryRGB,
                    {
                        0: { cellWidth: 35 },
                        1: { cellWidth: 20 },
                        2: { cellWidth: 15, halign: "center" },
                        3: { cellWidth: 15, halign: "center" },
                        4: { cellWidth: 15, halign: "center" },
                        5: { cellWidth: 30 },
                    }
                );
            } else {
                yOffset += 6;
            }

            doc.setDrawColor(200, 200, 200);
            doc.setLineWidth(0.3);
            doc.line(14, yOffset, pageWidth - 14, yOffset);
            yOffset += 8;
        }
        yOffset += 6;
    }

    addFooter(doc, options.establishmentName, doc.getNumberOfPages());
    return doc.output("datauristring");
}

export function generatePurchasesPDF(data: PurchaseReportResponse, options: PdfReportOptions): string {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const primaryRGB = hexToRgb(options.primaryColor || "#4F46E5");
    const secondaryRGB = hexToRgb(options.secondaryColor || "#7C3AED");

    addReportHeader(
        doc,
        options.title,
        options.subtitle,
        options.establishmentName,
        primaryRGB,
        secondaryRGB,
        options.periodStart,
        options.periodEnd
    );

    let yOffset = 58;

    yOffset = addSummaryCards(doc, yOffset, [
        { label: "Total de Itens", value: data.totalItems?.toString() || "0" },
        { label: "Valor Total", value: formatCurrency(data.totalAmount || 0) },
        { label: "Total de Produtos", value: data.items?.length?.toString() || "0" },
    ], primaryRGB);

    if (data.items && data.items.length > 0) {
        const tableData = data.items.map((item) => [
            item.productName,
            item.supplierName || "-",
            formatDate(item.purchaseDate),
            item.quantity.toString(),
            formatCurrency(item.purchasePrice),
            formatCurrency(item.salePrice),
            formatCurrency(item.subtotal),
        ]);

        yOffset = createTable(
            doc,
            yOffset,
            ["Produto", "Fornecedor", "Data", "Qtd", "Preço Compra", "Preço Venda", "Subtotal"],
            tableData,
            primaryRGB,
            {
                0: { cellWidth: 35 },
                1: { cellWidth: 30 },
                2: { cellWidth: 22 },
                3: { cellWidth: 15, halign: "center" },
                4: { cellWidth: 25, halign: "right" },
                5: { cellWidth: 25, halign: "right" },
                6: { cellWidth: 25, halign: "right" },
            }
        );
    }

    // Assinaturas
    if (yOffset > 230) {
        doc.addPage();
        yOffset = 30;
    } else {
        yOffset = pageHeight - 80;
    }

    doc.setFontSize(12);
    doc.setTextColor(primaryRGB[0], primaryRGB[1], primaryRGB[2]);
    doc.setFont("helvetica", "bold");
    doc.text("Assinaturas", pageWidth / 2, yOffset, { align: "center" });
    yOffset += 10;

    doc.setFontSize(8);
    doc.setTextColor(80, 80, 80);
    doc.setFont("helvetica", "normal");
    doc.text("Declaro que os produtos listados neste relatorio foram devidamente recebidos.", pageWidth / 2, yOffset, { align: "center" });
    yOffset += 12;

    const signatureY = yOffset;

    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(14, signatureY, 100, signatureY);
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.setFont("helvetica", "bold");
    doc.text("Assinatura do Comprador", 14, signatureY + 6);

    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.setFont("helvetica", "normal");
    doc.text(`Data: ${new Date().toLocaleDateString("pt-MZ")}`, 14, signatureY + 14);

    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(pageWidth - 100, signatureY, pageWidth - 14, signatureY);
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.setFont("helvetica", "bold");
    doc.text("Assinatura do Fornecedor", pageWidth - 100, signatureY + 6);

    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.setFont("helvetica", "normal");
    doc.text(`Data: ${new Date().toLocaleDateString("pt-MZ")}`, pageWidth - 100, signatureY + 14);

    const supplierName = data.items && data.items.length > 0 ? data.items[0].supplierName : "___________________";
    doc.setFontSize(8);
    doc.setTextColor(80, 80, 80);
    doc.setFont("helvetica", "normal");
    doc.text(`Nome do Fornecedor: ${supplierName}`, pageWidth - 100, signatureY + 24);

    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(14, signatureY + 36, pageWidth - 14, signatureY + 36);

    addFooter(doc, options.establishmentName, doc.getNumberOfPages());
    return doc.output("datauristring");
}

export function generateCostsPDF(data: CostsReportItem[], options: PdfReportOptions): string {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const primaryRGB = hexToRgb(options.primaryColor || "#4F46E5");
    const secondaryRGB = hexToRgb(options.secondaryColor || "#7C3AED");

    addReportHeader(
        doc,
        options.title,
        options.subtitle,
        options.establishmentName,
        primaryRGB,
        secondaryRGB,
        options.periodStart,
        options.periodEnd
    );

    let yOffset = 58;
    const totalAmount = data.reduce((sum, c) => sum + c.amount, 0);

    yOffset = addSummaryCards(doc, yOffset, [
        { label: "Total de Registros", value: data.length.toString() },
        { label: "Valor Total", value: formatCurrency(totalAmount) },
        { label: "Total de Categorias", value: new Set(data.map((c) => c.categoryName)).size.toString() },
    ], primaryRGB);


    const groupedByMonth = groupByMonth(data, (item) => item.referenceDate);

    for (const [monthLabel, costs] of Object.entries(groupedByMonth)) {
        if (yOffset > 250) {
            doc.addPage();
            yOffset = 20;
        }

        doc.setFontSize(14);
        doc.setTextColor(primaryRGB[0], primaryRGB[1], primaryRGB[2]);
        doc.setFont("helvetica", "bold");
        doc.text(`📅 ${monthLabel}`, 14, yOffset);
        yOffset += 8;

        const monthTotal = costs.reduce((sum, c) => sum + c.amount, 0);
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.setFont("helvetica", "normal");
        yOffset += 6;

        const tableData = costs.map((item) => [
            item.description,
            item.categoryName,
            item.period,
            formatDate(item.referenceDate),
            formatCurrency(item.amount),
        ]);

        yOffset = createTable(
            doc,
            yOffset,
            ["Descrição", "Categoria", "Período", "Data", "Valor"],
            tableData,
            primaryRGB,
            {
                0: { cellWidth: 45 },
                1: { cellWidth: 30 },
                2: { cellWidth: 20 },
                3: { cellWidth: 25 },
                4: { cellWidth: 30, halign: "right" },
            }
        );
    }

    addFooter(doc, options.establishmentName, doc.getNumberOfPages());
    return doc.output("datauristring");
}

export function generateStockPDF(data: InventoryReportResponse, options: StockReportOptions): string {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const primaryRGB = hexToRgb(options.primaryColor || "#4F46E5");
    const secondaryRGB = hexToRgb(options.secondaryColor || "#7C3AED");

    addReportHeader(
        doc,
        "Relatório de Stock Atual",
        "Análise completa do stock atual",
        options.establishmentName,
        primaryRGB,
        secondaryRGB,
        data.generatedAt,
        data.generatedAt
    );

    let yOffset = 58;

    yOffset = addSummaryCards(doc, yOffset, [
        { label: "Total de Produtos", value: data.totalProducts.toString() },
        { label: "Produtos com Stock", value: data.totalStockControlledProducts.toString() },
        { label: "Quantidade Total", value: data.totalStockQuantity.toFixed(2) },
    ], primaryRGB);

    if (data.products && data.products.length > 0) {
        const tableData = data.products.map((item) => {
            const ingredients = "ingredients" in item
                ? (item as any).ingredients
                : undefined;

            return [
                item.name,
                item.category || "-",
                item.stockQuantity.toFixed(2),
                ingredients && ingredients.length > 0
                    ? ingredients.map((i: any) => i.ingredientName).join(", ")
                    : "-",
            ];
        });

        yOffset = createTable(
            doc,
            yOffset,
            ["Produto", "Categoria", "Quantidade", "Ingredientes"],
            tableData,
            primaryRGB,
            {
                0: { cellWidth: 40 },
                1: { cellWidth: 30 },
                2: { cellWidth: 25, halign: "center" },
                3: { cellWidth: 45 },
            }
        );
    }

    addFooter(doc, options.establishmentName, doc.getNumberOfPages());
    return doc.output("datauristring");
}