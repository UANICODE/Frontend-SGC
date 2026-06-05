// service/attendant/assignSale.ts
import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";

export interface AssignSaleRequest {
  tableId?: string;
  waiterId?: string;
}

export async function assignSale(
  saleId: string,
  establishmentId: string,
  payload: AssignSaleRequest
): Promise<void> {
  try {
    await api.put(`/api/attendant/sales/${saleId}/assign?establishmentId=${establishmentId}`, payload);
  } catch (e) {
    handleHttpError(e);
  }
}