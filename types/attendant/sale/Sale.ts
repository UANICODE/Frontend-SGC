export interface SaleItem {
  itemId: string;
  productId: string;
  productName: string;
  quantity: number;      // Para produtos por peso, é o peso em gramas
  unitPrice: number;     // Para produtos por peso, é o preço total
  subtotal: number;
  isWeightBased?: boolean;
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
  paymentMethod: string;
  amount: number;
}

