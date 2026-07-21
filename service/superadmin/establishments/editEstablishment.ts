import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import {
  EditEstablishmentRequest,
  EditEstablishmentResponse,
} from "@/types/superadmin/establishments/editEstablishment";

export async function editEstablishment(
  establishmentId: string,
  payload: EditEstablishmentRequest
): Promise<EditEstablishmentResponse> {
  try {
    const response = await api.put<EditEstablishmentResponse>(
      `/api/superadmin/establishments/${establishmentId}`,
      payload
    );

    return response.data;
  } catch (error) {
    handleHttpError(error);
    throw error;
  }
}