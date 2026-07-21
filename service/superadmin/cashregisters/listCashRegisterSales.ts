import api from "@/service/api";
import { ListCashRegisterSalesRequest, ListCashRegisterSalesResponse } from "@/types/superadmin/cashregisters/listCashRegisterSales";
import { handleHttpError } from "@/utils/httpErrorHandler";


export async function listCashRegisterSales(
  cashRegisterId: string,
  payload: ListCashRegisterSalesRequest
): Promise<ListCashRegisterSalesResponse> {
  try {
    const response =
      await api.post<ListCashRegisterSalesResponse>(
        `/api/superadmin/cash-registers/${cashRegisterId}/sales/filter`,
        payload
      );

    return response.data;
  } catch (error) {
    handleHttpError(error);
    throw error;
  }
}