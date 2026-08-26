export interface EstablishmentAdministratorResponse {
  userUid: string;
  name: string;
  email: string;
  phone: string | null;
  profilePhotoUrl: string | null;
  active: boolean;
  linkedAt: string;
}

export interface AvailableAdministratorResponse {
  userUid: string;
  name: string;
  email: string;
  phone: string | null;
  profilePhotoUrl: string | null;
}

export interface ListAvailableAdministratorsResponse {
  content: AvailableAdministratorResponse[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface AssignEstablishmentAdministratorRequest {
  userUid: string;
}