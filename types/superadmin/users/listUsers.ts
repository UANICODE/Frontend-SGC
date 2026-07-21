export interface UserRoleResponse {
  id: number;
  name: string;
}

export interface UserItemResponse {
  uid: string;
  nome: string;
  email: string;
  fotoPerfil: string | null;
  telefone: string | null;
  endereco: string | null;
  ativo: boolean;
  roles: UserRoleResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface ListUsersRequest {
  page: number;
  size: number;
  search?: string | null;
  active?: boolean | null;
  roleName?: string | null;
}

export interface ListUsersResponse {
  content: UserItemResponse[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
}