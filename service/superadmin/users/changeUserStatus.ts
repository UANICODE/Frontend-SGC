import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import {
  ChangeUserStatusRequest,
  ChangeUserStatusResponse,
} from "@/types/superadmin/users/changeUserStatus";

export async function changeUserStatus(
  userUid: string,
  payload: ChangeUserStatusRequest
): Promise<ChangeUserStatusResponse> {
  try {
    const response = await api.patch<ChangeUserStatusResponse>(
      `/api/superadmin/users/${userUid}/status`,
      payload
    );

    return response.data;
  } catch (error) {
    handleHttpError(error);
    throw error;
  }
}