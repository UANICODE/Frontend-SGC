import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";

export async function transferStock(data: {
  fromEstablishmentId: string;
  toEstablishmentId: string;
  productId: string;
  quantity: number;
}) {
  try {

    const res = await api.post("/api/admin/stock/transfer", data);
    return res.data; // 👈 importante
  } catch (error: any) {
   throw error;
    throw error;
  }
}