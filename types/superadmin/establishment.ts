export interface ListEstablishmentsResponse {
  id: string;
  tradeName: string;
  legalName: string;
  logoUrl: string;
  email: string;
  phone: string;
  status: string;
  active: boolean;
  createdAt: string;
}

export interface CreateEstablishmentRequest {
  tradeName: string;
  legalName?: string;
  nuit?: string;
  email: string;
  phone?: string;
  address?: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

export interface CreateEstablishmentResponse {
  id: string;
  tradeName: string;
  legalName: string;
  nuit: string;
  email: string;
  phone: string;
  address: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  status: string;
  active: boolean;
  createdAt: string;
}