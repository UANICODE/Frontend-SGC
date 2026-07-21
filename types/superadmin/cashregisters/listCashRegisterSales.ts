export type CashRegisterSaleStatus =
  | "RASCUNHO"
  | "ARQUIVADO"
  | "AGUARDANDO_PAGAMENTO"
  | "FINALIZADO"
  | "CANCELADO";

export interface ListCashRegisterSalesRequest {
  page: number;
  size: number;
  search?: string | null;
  status?: CashRegisterSaleStatus | null;
}

export interface CashRegisterSaleItemResponse {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface CashRegisterSaleResponse {
  id: string;
  saleNumber: string;
  userUid: string;
  userName: string | null;
  userEmail: string | null;
  status: string;
  paymentMethodName: string | null;
  tableNumber: string | null;
  waiterName: string | null;
  subtotal: number;
  discount: number;
  total: number;
  saleDate: string;
  cancellationDate: string | null;
  items: CashRegisterSaleItemResponse[];
}

export interface CashRegisterSalesContextResponse {
  cashRegisterId: string;
  establishmentId: string;
  establishmentName: string;
  establishmentLogoUrl: string | null;
  businessTypeCode: string;
  businessTypeName: string;
  cashRegisterStatus: string;
  openedAt: string;
  closedAt: string | null;
  totalSalesCalculated: number;
  totalCancelled: number;
  netTotal: number;
}

export interface ListCashRegisterSalesResponse {
  cashRegister: CashRegisterSalesContextResponse;
  content: CashRegisterSaleResponse[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
}