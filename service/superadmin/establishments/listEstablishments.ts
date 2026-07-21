import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import {
  ListEstablishmentsRequest,
  ListEstablishmentsResponse,
} from "@/types/superadmin/establishments/listEstablishments";

export async function listEstablishments(
  payload: ListEstablishmentsRequest
): Promise<ListEstablishmentsResponse> {
  try {
    const response = await api.post<ListEstablishmentsResponse>(
      "/api/superadmin/establishments/filter",
      payload
    );

    return response.data;
  } catch (error) {
    handleHttpError(error);
    throw error;
  }
}