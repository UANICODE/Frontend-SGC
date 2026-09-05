import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";

export async function getSuperDashboard() {

  try {
      const res = await api.get("/api/admin/super/dashboard");
  return res.data;
} catch(error) {
  handleHttpError(error);
}
}