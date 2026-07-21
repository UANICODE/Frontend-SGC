import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import {
  ManageUserRoleRequest,
  ManageUserRoleResponse,
} from "@/types/superadmin/users/manageUserRole";

export async function manageUserRole(
  userUid: string,
  payload: ManageUserRoleRequest
): Promise<ManageUserRoleResponse> {
  try {
    const response = await api.patch<ManageUserRoleResponse>(
      `/api/superadmin/users/${userUid}/roles`,
      payload
    );

    return response.data;
  } catch (error) {
    handleHttpError(error);
    throw error;
  }
}