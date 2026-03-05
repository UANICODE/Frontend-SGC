export interface EstablishmentStatusSummaryResponse {
  establishmentId: string;
  tradeName: string;
  status: string;
  active: boolean;
}

export interface EstablishmentSalesSummaryResponse {
  establishmentId: string;
  tradeName: string;
  totalSales: number;
}

export interface EstablishmentUsersSummaryResponse {
  establishmentId: string;
  tradeName: string;
  totalUsers: number;
}