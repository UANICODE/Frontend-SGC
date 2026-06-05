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
}