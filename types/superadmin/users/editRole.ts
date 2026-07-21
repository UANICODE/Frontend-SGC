export interface EditRoleRequest {
  name: string;
}

export interface EditRoleResponse {
  id: number;
  previousName: string;
  name: string;
  message: string;
}