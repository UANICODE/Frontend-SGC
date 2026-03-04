import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";

export async function logoutService() {
  try {
    await api.post("/api/auth/logout");
  } catch (error) {
    handleHttpError(error);
  }
}