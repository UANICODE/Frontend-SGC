import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";

export interface ArchivedSale {
  saleId: string;
  subtotal: number;
  discount: number;
  total: number;
  createdAt: string;
}

export async function listArchivedSales(
  establishmentId: string,
  cashRegisterId: string
): Promise<ArchivedSale[]> {
  try {
    const response = await api.get<ArchivedSale[]>(
      `/api/attendant/sales/archived`,
      {
        params: { establishmentId, cashRegisterId },
      }
    );

    return response.data;
  } catch (error) {
    handleHttpError(error);
  }
}