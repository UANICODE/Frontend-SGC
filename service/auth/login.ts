// loginService.ts
import api from "@/service/api";
import { LoginCredentials, LoginResponseDTO } from "@/types/auth/types";

export async function loginService(credentials: LoginCredentials) {
  try {
    const response = await api.post<LoginResponseDTO>("/api/auth/user/login", credentials);
    return response.data;
  } catch (error: any) {
    // ⚠️ pega exatamente a mensagem do backend
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Erro ao fazer login");
  }
}