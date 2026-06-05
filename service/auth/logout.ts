import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";

export async function logoutService() {
  try {
    const deviceId = localStorage.getItem("deviceId");
    if (!deviceId) throw new Error("DeviceId não encontrado no logout");

    await api.post("/api/auth/logout", null, {
      headers: { "X-Device-Id": deviceId },
      withCredentials: true,
    });

    // Remove deviceId do frontend
    localStorage.removeItem("deviceId");

  } catch (error) {
    handleHttpError(error);
  }
}