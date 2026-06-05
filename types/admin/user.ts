export interface CreateUserRequest {
  establishmentId: string;
  nome: string;
  email: string;
  password: string;
  role: string;
}

export interface CreateUserResponse {
  uid: string;
  nome: string;
  email: string;
  role: string;
  ativo: boolean;
}

export interface ToggleUserStatusRequest {
  establishmentId: string;
  userUid: string;
  ativo: boolean;
}

export interface ToggleUserStatusResponse {
  userUid: string;
  ativo: boolean;
}

export interface ResetUserPasswordRequest {
  establishmentId: string;
  userUid: string;
  newPassword: string;
}

export interface ResetUserPasswordResponse {
  userUid: string;
  message: string;
}

export interface ManageUserRoleRequest {
  establishmentId: string;
  userUid: string;
  roleName: string;
  add: boolean;
}

export interface ManageUserRoleResponse {
  userUid: string;
  roleName: string;
  message: string;
}

export interface ListUsersByEstablishmentRequest {
  establishmentId: string;
}

export interface ListUsersByEstablishmentResponse {
  userUid: string;
  nome: string;
  email: string;
  ativo: boolean;
  role: string;
}

export interface FilterUsersRequest {
  establishmentId: string;
  nome?: string;
  email?: string;
  ativo?: boolean;
}

export interface FilterUsersResponse {
  userUid: string;
  nome: string;
  email: string;
  ativo: boolean;
  role: string;
}