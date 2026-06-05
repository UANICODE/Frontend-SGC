import api from "@/service/api";
import { LoginCredentials, LoginResponseDTO } from "@/types/auth/types";

export async function loginService(credentials: LoginCredentials) {
  try {
    // 🔹 Pega ou gera o deviceId único
    let deviceId = localStorage.getItem("deviceId");
    if (!deviceId) {
      deviceId = crypto.randomUUID();
      localStorage.setItem("deviceId", deviceId);
    }
console.log("Aqui esta deviceid", deviceId);
    // 🔹 Envia o deviceId no header
    const response = await api.post<LoginResponseDTO>(
      "/api/auth/user/login",
      credentials,
      {
        headers: { "X-Device-Id": deviceId },
      }
    );

    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Erro ao fazer login");
  }
}