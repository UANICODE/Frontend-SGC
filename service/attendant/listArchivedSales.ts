import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";

// types/attendant/sale/ArchivedSale.ts
export interface ArchivedSale {
  saleId: string;
  subtotal: number;
  discount: number;
  total: number;
  saleDate: string;  // ✅ Mudar de createdAt para saleDate
  tableNumber?: string;
  tableLocation?: string;
  waiterName?: string;
  waiterPhone?: string;
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