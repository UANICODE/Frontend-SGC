export interface InventoryProductItem {
  productId: string;
  productName: string;
  categoryName: string;
  stockQuantity: number;
  stockControlled: boolean;
}

export interface InventoryReportResponse {
  establishmentId: string;
  establishmentName: string;
  logoUrl: string;
  address: string;
  phone: string;
  generatedAt: string;
  totalProducts: number;
  totalStockControlledProducts: number;
  totalStockQuantity: number;
  products: InventoryProductItem[];
}

export interface PaymentSummary {
  paymentMethodName: string;
  total: number;
}

export interface SalesReportResponse {
  establishmentId: string;
  establishmentName: string;
  logoUrl: string;
  address: string;
  phone: string;
  startDate: string;
  endDate: string;
  generatedAt: string;
  totalSales: number;
  totalCancelled: number;
  netTotal: number;
  totalTransactions: number;
  averageTicket: number;
  payments: PaymentSummary[];
}