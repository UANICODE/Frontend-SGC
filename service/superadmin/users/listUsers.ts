import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import {
  ListUsersRequest,
  ListUsersResponse,
} from "@/types/superadmin/users/listUsers";

export async function listUsers(
  payload: ListUsersRequest
): Promise<ListUsersResponse> {
  try {
    const response = await api.post<ListUsersResponse>(
      "/api/superadmin/users/filter",
      payload
    );

    return response.data;
  } catch (error) {
    handleHttpError(error);
    throw error;
  }
}