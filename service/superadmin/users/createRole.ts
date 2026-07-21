import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import {
  CreateRoleRequest,
  CreateRoleResponse,
} from "@/types/superadmin/users/createRole";

export async function createRole(
  payload: CreateRoleRequest
): Promise<CreateRoleResponse> {
  try {
    const response = await api.post<CreateRoleResponse>(
      "/api/superadmin/roles",
      payload
    );

    return response.data;
  } catch (error) {
    handleHttpError(error);
    throw error;
  }
}