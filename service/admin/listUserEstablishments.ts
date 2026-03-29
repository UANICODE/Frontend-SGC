import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";

export async function listUserEstablishments() {
  try {
    const res = await api.get("/api/admin/stock/establishments");
   
    return res.data;
  } catch (error) {
    handleHttpError(error);
  }
}