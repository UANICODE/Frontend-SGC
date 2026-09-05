// types/admin/purchase.ts

export interface PurchaseItemRequest {
    productId: string;
    quantity: number;
    purchasePrice: number;
}

export interface PurchaseItemResponse {
    productId: string;
    productName: string;
    productCategory: string | null;
    quantity: number;
    purchasePrice: number;
    subtotal: number;
}

export interface CreatePurchaseRequest {
    establishmentId: string;
    supplierId: string;
    items: PurchaseItemRequest[];
    notes?: string;
}

export interface PurchaseResponse {
    purchaseId: string;
    supplierName: string;
    supplierNuit: string | null;
    purchaseDate: string;
    totalAmount: number;
    totalItems: number;
    items: PurchaseItemResponse[];
    notes: string | null;
}

export interface CartItem {
    productId: string;
    productName: string;
    productImage?: string;
    quantity: number;
    purchasePrice: number;
    stockQuantity: number;
    price: number; // preço de venda
}

export interface ListPurchasesRequest {
    establishmentId: string;
    page?: number;
    size?: number;
}

export interface ListPurchasesResponse {
    content: PurchaseResponse[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}

export interface ProductForPurchase {
    id: string;
    name: string;
    price: number;
    purchasePrice: number | null;
    stockQuantity: number;
    categoryName: string | null;
    imageurl: string | null;
}



export interface PurchaseFilterRequest {
    establishmentId: string;
    supplierId?: string;
    startDate?: string;
    endDate?: string;
}