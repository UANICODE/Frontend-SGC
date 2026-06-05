/* ============================================================
   ADD STOCK
   ============================================================ */

export interface AddProductStockRequest {
  establishmentId: string;
  productId: string;
  supplierId: string;
  quantityToAdd: number;
  referenceDocument?: string;
}

export interface AddProductStockResponse {
  productId: string;
  productName: string;
  previousQuantity: number;
  addedQuantity: number;
  currentQuantity: number;
}

/* ============================================================
   UPDATE STOCK
   ============================================================ */

export interface UpdateProductStockRequest {
  establishmentId: string;
  productId: string;
 quantityToAdd: number;
}

export interface UpdateProductStockResponse {
  productId: string;
  productName: string;
  quantity: number;
}

/* ============================================================
   LIST STOCK
   ============================================================ */

export interface ListProductStocksRequest {
  establishmentId: string;
  page?: number;
  size?: number;
}

export interface ProductStockItemResponse {
  productId: string;
  productName: string;
  quantity: number;
  data: string;
}

export interface ListProductStocksResponse {
  content: ProductStockItemResponse[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}