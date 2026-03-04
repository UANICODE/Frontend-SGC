export type UserRole = "SUPERADMIN" | "ADMIN" | "ATENDENTE";

export interface AuthUser {
  uid: string;
  email: string;
  roles: UserRole[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponseDTO {
  uid: string;
  email: string;
  roles: UserRole[];
}