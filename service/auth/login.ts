import api from "@/service/api";
import { LoginCredentials, LoginResponseDTO } from "@/types/auth/types";
import { handleHttpError } from "@/utils/httpErrorHandler";

export async function loginService(credentials: LoginCredentials) {
  try {
    const response = await api.post<LoginResponseDTO>(
      "/api/auth/user/login",
      credentials
    );
    return response.data;
  } catch (error) {
    handleHttpError(error);
  }
}