import api from "@/service/api";
import { CashClosingReceipt } from "@/types/attendant/CashRegister";
import { handleHttpError } from "@/utils/httpErrorHandler";



export async function closeCashRegister(
  cashRegisterId: string
): Promise<CashClosingReceipt> {
  try {
    const response = await api.post<CashClosingReceipt>(
      `/api/attendant/cash-registers/${cashRegisterId}/close`
    );

    return response.data;
  } catch (error) {
    handleHttpError(error);
  }
}