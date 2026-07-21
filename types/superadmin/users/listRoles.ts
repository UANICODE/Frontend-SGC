export interface RoleItemResponse {
  id: number;
  name: string;
}

export interface ListRolesResponse {
  content: RoleItemResponse[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
}