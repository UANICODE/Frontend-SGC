import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import {
  LoggedEstablishmentResponse,
  UpdateEstablishmentRequest,
  UpdateEstablishmentResponse,
} from "@/types/admin/establishment";

export async function getLoggedEstablishment(
  establishmentId: string
): Promise<LoggedEstablishmentResponse> {
  try {
    const res = await api.get("/api/me/establishment", {
      headers: {
        "X-Establishment-Id": establishmentId,
      },
    });

    return res.data;
  } catch (error) {
    handleHttpError(error);
  }
}

export async function updateEstablishment(
  data: UpdateEstablishmentRequest
): Promise<UpdateEstablishmentResponse> {
  try {
    const res = await api.put(
      "/api/admin/establishment/update",
      data
    );

    return res.data;
  } catch (error) {
    handleHttpError(error);
  }
}