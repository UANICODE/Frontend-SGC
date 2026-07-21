export interface EditEstablishmentRequest {
  tradeName: string;
  legalName?: string | null;
  nuit?: string | null;
  email: string;
  phone?: string | null;
  address?: string | null;
  logoUrl?: string | null;
  primaryColor?: string | null;
  secondaryColor?: string | null;
  businessTypeId: string;
}

export interface EditEstablishmentResponse {
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
  businessTypeId: string;
  businessTypeCode: string;
  businessTypeName: string;
  updatedAt: string;
  message: string;
}