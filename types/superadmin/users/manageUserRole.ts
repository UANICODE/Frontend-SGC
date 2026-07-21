import { UserRoleResponse } from "./listUsers";

export type UserRoleOperation = "ASSIGN" | "REMOVE";

export interface ManageUserRoleRequest {
  roleId: number;
  operation: UserRoleOperation;
}

export interface ManageUserRoleResponse {
  userUid: string;
  roleId: number;
  roleName: string;
  operation: UserRoleOperation;
  message: string;
  roles: UserRoleResponse[];
}