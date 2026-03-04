import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import {
  ListOpenCashRegistersRequest,
  OpenCashRegisterResponse,
} from "@/types/admin/cash-register";

export async function listOpenCashRegisters(
  data: ListOpenCashRegistersRequest
): Promise<OpenCashRegisterResponse[]> {
  try {
    const response = await api.post(
      "/api/admin/cash-registers/open",
      data
    );

    return response.data;
  } catch (error) {
    handleHttpError(error);
  }
}