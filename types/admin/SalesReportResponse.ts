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
}