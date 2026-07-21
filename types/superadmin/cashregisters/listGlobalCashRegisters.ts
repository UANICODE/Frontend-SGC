export type GlobalCashRegisterStatus =
  | "ABERTO"
  | "FECHADO";

export interface ListGlobalCashRegistersRequest {
  page: number;
  size: number;
  search?: string | null;
  establishmentId?: string | null;
  status?: GlobalCashRegisterStatus | null;
  startDate?: string | null;
  endDate?: string | null;
}

export interface GlobalCashRegisterItemResponse {
  id: string;
  establishmentId: string;
  establishmentName: string;
  establishmentLogoUrl: string | null;
  businessTypeCode: string | null;
  businessTypeName: string | null;
  userUid: string;
  userName: string | null;
  userEmail: string | null;
  status: string;
  openedAt: string;
  closedAt: string | null;
  totalSalesCalculated: number;
  totalCancelled: number;
  netTotal: number;
}

export interface ListGlobalCashRegistersResponse {
  content: GlobalCashRegisterItemResponse[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
}