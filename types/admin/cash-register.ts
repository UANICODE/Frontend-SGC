export interface ListOpenCashRegistersRequest {
  establishmentId: string;
}

export interface PaymentMethodTotalResponse {
  paymentMethod: string;
  total: number;
}

export interface OpenCashRegisterResponse {
  cashRegisterId: string;
  userUid: string;
  attendantName: string;
  openedAt: string;
  closedAt?: string; // novo
  status: "ABERTO" | "FECHADO"; // novo
  totalSold: number;
  totalsByPaymentMethod: PaymentMethodTotalResponse[];
}

export interface CashRegisterSaleItem {
  productName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  imageUrl?: string;
}

export interface CashRegisterSale {
  saleNumber: number;
  attendantName: string;
  status: string;
  paymentMethod: string;
  subtotal: number;
  discount: number;
  total: number;
  createdAt: string;
  version: number;
  items: CashRegisterSaleItem[];
}