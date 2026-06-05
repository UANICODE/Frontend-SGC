import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import {
  CreateUserRequest,
  CreateUserResponse,
  ToggleUserStatusRequest,
  ToggleUserStatusResponse,
  ResetUserPasswordRequest,
  ResetUserPasswordResponse,
  ManageUserRoleRequest,
  ManageUserRoleResponse,
  ListUsersByEstablishmentRequest,
  ListUsersByEstablishmentResponse,
  FilterUsersRequest,
  FilterUsersResponse,
} from "@/types/admin/user";

export async function createUser(
  data: CreateUserRequest
): Promise<CreateUserResponse> {
  try {
    const res = await api.post("/api/admin/users/create", data);
    return res.data;
  } catch (error) {
    handleHttpError(error);
  }
}

export async function listUsers(
  data: ListUsersByEstablishmentRequest
): Promise<ListUsersByEstablishmentResponse[]> {
  try {
    const res = await api.post(
      "/api/admin/users/by-establishment",
      data
    );
    return res.data;
  } catch (error) {
    handleHttpError(error);
  }
}

export async function filterUsers(
  data: FilterUsersRequest
): Promise<FilterUsersResponse[]> {
  try {
    const res = await api.post(
      "/api/admin/users/filter",
      data
    );
    return res.data;
  } catch (error) {
    handleHttpError(error);
  }
}

export async function toggleUserStatus(
  data: ToggleUserStatusRequest
): Promise<ToggleUserStatusResponse> {
  try {
    const res = await api.put(
      "/api/admin/users/status/update",
      data
    );
    return res.data;
  } catch (error) {
    handleHttpError(error);
  }
}

export async function resetUserPassword(
  data: ResetUserPasswordRequest
): Promise<ResetUserPasswordResponse> {
  try {
    const res = await api.put(
      "/api/admin/users/password",
      data
    );
    return res.data;
  } catch (error) {
    handleHttpError(error);
  }
}

export async function manageUserRole(
  data: ManageUserRoleRequest
): Promise<ManageUserRoleResponse> {
  try {
    const res = await api.put(
      "/api/admin/users/roles",
      data
    );
    return res.data;
  } catch (error) {
    handleHttpError(error);
  }
}