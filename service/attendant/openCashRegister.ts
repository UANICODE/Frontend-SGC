import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";

export interface OpenCashRegisterRequest {
  establishmentId: string;
}

export interface OpenCashRegisterResponse {
  cashRegisterId: string;
  openedAt: string;
  message: string;
}

export async function openCashRegister(
  payload: OpenCashRegisterRequest
): Promise<OpenCashRegisterResponse> {
  try {
    const response = await api.post<OpenCashRegisterResponse>(
      "/api/attendant/cash-register/open",
      payload
    );

    return response.data;
  } catch (error) {
    handleHttpError(error);
    throw error;
  }
}