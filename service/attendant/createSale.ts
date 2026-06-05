import api from "@/service/api";
import { CreateSaleRequest, SaleResponse } from "@/types/attendant/sale/Sale";


export async function createSale(
  payload: CreateSaleRequest
): Promise<SaleResponse> {
  const response = await api.post<SaleResponse>(
    "/api/attendant/sales",
    payload
  );

  return response.data;
}