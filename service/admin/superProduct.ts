import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";

export async function searchSuperProduct(name: string) {

  try {
      const res = await api.post("/api/admin/super/products/search", { name });
  return res.data;
  } catch(error) {
    handleHttpError(error);
}
}