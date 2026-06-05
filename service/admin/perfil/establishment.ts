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
  establishmentId: string,
  data: UpdateEstablishmentRequest
): Promise<UpdateEstablishmentResponse> {
  try {
    console.log("ID:", establishmentId);
console.log("TYPE:", typeof establishmentId);
    const res = await api.put(
      `/api/admin/establishment/update/${establishmentId}`,
      data
    );

    return res.data;
  } catch (error) {
    handleHttpError(error);
  }

}