import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import { DeleteRoleResponse } from "@/types/superadmin/users/deleteRole";

export async function deleteRole(
  roleId: number
): Promise<DeleteRoleResponse> {
  try {
    const response = await api.delete<DeleteRoleResponse>(
      `/api/superadmin/roles/${roleId}`
    );

    return response.data;
  } catch (error) {
    handleHttpError(error);
    throw error;
  }
}