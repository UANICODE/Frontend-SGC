export interface ChangeUserStatusRequest {
  active: boolean;
}

export interface ChangeUserStatusResponse {
  uid: string;
  nome: string;
  email: string;
  active: boolean;
  updatedAt: string;
  message: string;
}