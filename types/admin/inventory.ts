// types/admin/inventory.ts

export interface InventoryType {
    id: string;
    name: string;
    description: string;
}

export interface InventoryStatus {
    id: string;
    name: string;
}

export interface InventoryItem {
    id: string;
    productId: string | null;
    assetId: string | null;
    itemName: string;
    itemType: 'PRODUCT' | 'ASSET';
    expectedQuantity: number;
    countedQuantity: number;
    difference: number;
    lossType: string | null;
    justificationNotes: string | null;
    justified: boolean;
    notes: string | null;
}

export interface Inventory {
    id: string;
    establishmentId: string;
    establishmentName: string;
    typeId: string;
    typeName: string;
    statusId: string;
    statusName: string;
    startDate: string;
    endDate: string | null;
    responsibleUserName: string;
    notes: string | null;
    items: InventoryItem[];
}

export interface CreateInventoryRequest {
    establishmentId: string;
    typeId: string;
    notes?: string;
}

export interface CountInventoryRequest {
    inventoryId: string;
    items: { itemId: string; countedQuantity: number }[];
}

export interface JustifyInventoryRequest {
    inventoryId: string;
    items: { itemId: string; lossType: string; justificationNotes?: string }[];
}

export interface ApproveInventoryResponse {
    inventory: Inventory;
    adjustments: InventoryAdjustment[];
}

export interface InventoryAdjustment {
    itemName: string;
    itemType: string;
    expectedQuantity: number;
    countedQuantity: number;
    difference: number;
    action: string;
    lossType: string | null;
}

export interface InventoryDashboard {
    totalInventories: number;
    openInventories: number;
    countingInventories: number;
    reviewInventories: number;
    approvedInventories: number;
    lastInventory: {
        id: string;
        establishmentName: string;
        type: string;
        status: string;
        startDate: string;
        totalItems: number;
        itemsWithDifference: number;
    } | null;
    totalLossesFromInventory: number;
    totalLostItems: number;
    comparison: {
        currentMonthLosses: number;
        previousMonthLosses: number;
        percentageChange: number;
    };
}






// types/admin/inventory.ts

export interface InventoryType {
    id: string;
    name: string;
    description: string;
}

export interface InventoryStatus {
    id: string;
    name: string;
}