// types/admin/report.ts

export interface AssetsReportItem {
    id: string;
    code: string;
    name: string;
    category: string;
    quantity: number;
    purchaseValue: number;
    acquisitionDate: string;
    location: string;
    status: string;
}

export interface InventoryItemReportItem {
    itemName: string;
    itemType: string;
    expectedQuantity: number;
    countedQuantity: number;
    difference: number;
    lossType: string;
    justificationNotes: string;
}

export interface InventoriesReportItem {
    id: string;
    typeName: string;
    statusName: string;
    startDate: string;
    endDate: string;
    responsibleUserName: string;
    items: InventoryItemReportItem[];
}

export interface CostsReportItem {
    id: string;
    description: string;
    categoryName: string;
    amount: number;
    period: string;
    referenceDate: string;
    registeredByName: string;
    notes: string;
}



export interface PurchaseReport {
    purchaseId: string;
    supplierName: string;
    supplierNuit: string;
    purchaseDate: string;
    totalItems: number;
    totalAmount: number;
    items: PurchaseItemReport[];
}

export interface PurchaseFilterRequest {
    establishmentId: string;
    supplierId?: string;
    startDate?: string;
    endDate?: string;
}



export interface PurchaseItemReport {
    productName: string;
    productImage: string | null;
    quantity: number;
    purchasePrice: number;      // Preço de compra
    salePrice: number;          // 🆕 Preço de venda
    subtotal: number;
    purchaseDate: string;
    supplierName: string;
    supplierNuit: string;
}

export interface PurchaseReportResponse {
    items: PurchaseItemReport[];
    totalAmount: number;
    totalItems: number;
}