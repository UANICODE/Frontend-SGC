import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import { ListAdminEstablishmentsResponse } from "@/types/admin/AdminEstablishment";

export async function listAdminEstablishments(): Promise<
  ListAdminEstablishmentsResponse[]
> {
  try {
    const { data } = await api.get<ListAdminEstablishmentsResponse[]>(
      "/api/admin/establishments"
    );

    return data;
  } catch (error) {
    handleHttpError(error);
  }
}