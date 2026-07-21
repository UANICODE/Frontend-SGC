import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import {
  EditUserRequest,
  EditUserResponse,
} from "@/types/superadmin/users/editUser";

export async function editUser(
  userUid: string,
  payload: EditUserRequest
): Promise<EditUserResponse> {
  try {
    const response = await api.put<EditUserResponse>(
      `/api/superadmin/users/${userUid}`,
      payload
    );

    return response.data;
  } catch (error) {
    handleHttpError(error);
    throw error;
  }
}