import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";

export async function restoreSale(saleId: string): Promise<void> {
  try {
    await api.put(`/api/attendant/sales/${saleId}/restore`);
  } catch (error) {
    handleHttpError(error);
  }
}