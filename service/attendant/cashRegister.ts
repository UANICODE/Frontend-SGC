import api from "@/service/api";
import { CashRegister } from "@/types/attendant/CashRegister";
import { ListCashRegistersRequest } from "@/types/attendant/ListCashRegistersRequest";

export async function listCashRegisters(
  payload: ListCashRegistersRequest
): Promise<CashRegister[]> {
  const response = await api.post<CashRegister[]>(
    "/api/attendant/cash-registers/filter",
    payload
  );

  return response.data;
}