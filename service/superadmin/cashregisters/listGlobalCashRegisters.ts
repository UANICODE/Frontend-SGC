import api from "@/service/api";
import { ListGlobalCashRegistersRequest, ListGlobalCashRegistersResponse } from "@/types/superadmin/cashregisters/listGlobalCashRegisters";
import { handleHttpError } from "@/utils/httpErrorHandler";


export async function listGlobalCashRegisters(
  payload: ListGlobalCashRegistersRequest
): Promise<ListGlobalCashRegistersResponse> {
  try {
    const response =
      await api.post<ListGlobalCashRegistersResponse>(
        "/api/superadmin/cash-registers/filter",
        payload
      );

    return response.data;
  } catch (error) {
    handleHttpError(error);
    throw error;
  }
}