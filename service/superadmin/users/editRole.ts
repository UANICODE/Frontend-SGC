import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import {
  EditRoleRequest,
  EditRoleResponse,
} from "@/types/superadmin/users/editRole";

export async function editRole(
  roleId: number,
  payload: EditRoleRequest
): Promise<EditRoleResponse> {
  try {
    const response = await api.put<EditRoleResponse>(
      `/api/superadmin/roles/${roleId}`,
      payload
    );

    return response.data;
  } catch (error) {
    handleHttpError(error);
    throw error;
  }
}