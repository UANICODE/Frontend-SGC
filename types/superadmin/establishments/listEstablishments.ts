export interface EstablishmentListItemResponse {
  id: string;
  tradeName: string;
  legalName: string | null;
  nuit: string | null;
  email: string;
  phone: string | null;
  address: string | null;
  logoUrl: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  status: string | null;
  active: boolean;
  businessTypeId: string | null;
  businessTypeCode: string | null;
  businessTypeName: string | null;
  businessAccountId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ListEstablishmentsRequest {
  page: number;
  size: number;
  search?: string | null;
  active?: boolean | null;
  businessTypeId?: string | null;
}

export interface ListEstablishmentsResponse {
  content: EstablishmentListItemResponse[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
}