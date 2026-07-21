export interface EditUserRequest {
  nome: string;
  email: string;
  telefone?: string | null;
  endereco?: string | null;
  fotoPerfil?: string | null;
}

export interface EditUserResponse {
  uid: string;
  nome: string;
  email: string;
  telefone: string | null;
  endereco: string | null;
  fotoPerfil: string | null;
  ativo: boolean;
  updatedAt: string;
  message: string;
}