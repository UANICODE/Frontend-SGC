import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import { StockMovement } from "@/types/admin/product";

export async function listStockMovements(data: {
  establishmentId: string;
}): Promise<StockMovement[]> {
  try {
    const res = await api.post("/api/admin/stock-movements/list", data);
    return res.data;
  } catch (error) {
    handleHttpError(error);
  }
}