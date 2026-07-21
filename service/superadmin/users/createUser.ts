import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import {
  CreateUserRequest,
  CreateUserResponse,
} from "@/types/superadmin/users/createUser";

export async function createUser(
  payload: CreateUserRequest
): Promise<CreateUserResponse> {
  try {
    const response = await api.post<CreateUserResponse>(
      "/api/superadmin/users",
      payload
    );

    return response.data;
  } catch (error) {
    handleHttpError(error);
    throw error;
  }
}