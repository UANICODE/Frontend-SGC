export interface SaleItem {
  itemId: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Sale {
  saleId: string;
  status: string;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  total: number;
}


export interface CreateSaleRequest {
  establishmentId: string;
  cashRegisterId: string;
}

export interface SaleResponse {
  saleId: string;
  status: string;
  items: any[];
  subtotal: number;
  discount: number;
  total: number;
}


export interface PaymentSummary {
  paymentMethodName: string;
  total: number;
}

