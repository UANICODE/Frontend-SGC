import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";

export async function getSalesByEstablishment() {

  try {
          const res = await api.get("/api/admin/super/sales");
      return res.data;
  } catch(error) {
    handleHttpError(error);
  }
}