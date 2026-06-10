import { PaymentSummary } from "./sale/Sale";

export type CashRegisterStatus = "ABERTO" | "FECHADO" | "FINALIZADO";

export interface CashRegister {
  id: string;
  openedAt: string;
  closedAt: string | null;
  status: CashRegisterStatus;
  totalSalesCalculated: number;
  totalCancelled: number;
}


export interface CashClosingReceipt {
  cashRegisterId: string;
  establishmentName: string;
  establishmentLogoUrl: string;
  establishmentAddress: string;
  establishmentPhone: string;
  userName: string;
  openedAt: string;
  closedAt: string;
  totalSales: number;
  totalCancelled: number;
  netTotal: number;
  totalTransactions: number;
  payments: PaymentSummary[];
}


// types/attendant/cash-register.ts
export interface CashRegisterSaleItem {
  productName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  imageUrl?: string;
}

export interface CashRegisterSale {
  saleNumber: string;
  attendantName?: string;
  saleStatus: string;
  paymentMethod: string;
  subtotal: number;
  discount: number;
  total: number;
  createdAt: string;
  items: CashRegisterSaleItem[];
}