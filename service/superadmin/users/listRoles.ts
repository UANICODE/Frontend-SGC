import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import { ListRolesResponse } from "@/types/superadmin/users/listRoles";

export async function listRoles(
  page = 0,
  size = 100
): Promise<ListRolesResponse> {
  try {
    const response = await api.get<ListRolesResponse>(
      "/api/superadmin/roles",
      {
        params: {
          page,
          size,
        },
      }
    );

    return response.data;
  } catch (error) {
    handleHttpError(error);
    throw error;
  }
}