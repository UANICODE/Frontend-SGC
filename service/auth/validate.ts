import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";

export async function validateService() {
  try {
    await api.get("/api/auth/validate");
    return true;
  } catch (error) {
    handleHttpError(error);
  }
}