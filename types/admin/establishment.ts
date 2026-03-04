export interface LoggedEstablishmentResponse {
  establishmentId: string;
  tradeName: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
}

export interface UpdateEstablishmentRequest {
  tradeName: string;
  email: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

export interface UpdateEstablishmentResponse {
  id: string;
  tradeName: string;
  email: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  updatedAt: string;
}