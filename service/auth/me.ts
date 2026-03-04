import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";

export async function getCurrentUserService() {
  try {
    const response = await api.get("/api/auth/me");
    return response.data;
  } catch (error) {
    handleHttpError(error);
  }
}