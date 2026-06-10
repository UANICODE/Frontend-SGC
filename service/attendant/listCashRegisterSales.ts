// service/attendant/listCashRegisterSales.ts
import api from "@/service/api";
import { CashRegisterSale } from "@/types/attendant/CashRegister";

export async function listCashRegisterSales(data: {
  establishmentId: string;
  cashRegisterId: string;
}): Promise<CashRegisterSale[]> {
  try {
    const response = await api.post(
      `/api/attendant/cash-registers/sales`,
      data 
    );
    return response.data;
  } catch (error: any) {
    throw error?.response?.data?.message || "Ops!!";
  }
}