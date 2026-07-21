export interface CreateUserRequest {
  nome: string;
  email: string;
  password: string;
  confirmPassword: string;
  telefone?: string | null;
  endereco?: string | null;
  fotoPerfil?: string | null;
}

export interface CreateUserResponse {
  uid: string;
  nome: string;
  email: string;
  telefone: string | null;
  endereco: string | null;
  fotoPerfil: string | null;
  ativo: boolean;
  createdAt: string;
}