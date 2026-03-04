export interface SupplierStatusItemResponse {
  id: string;
  name: string;
  description: string;
}

export interface SupplierItemResponse {
  supplierId: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  nuit?: string;
  statusId: string;
  statusName: string;
}

export interface CreateSupplierRequest {
  establishmentId: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  nuit?: string;
  statusId: string;
}

export interface UpdateSupplierRequest {
  establishmentId: string;
  supplierId: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  nuit?: string;
  statusId?: string;
}

export interface DeleteSupplierRequest {
  establishmentId: string;
  supplierId: string;
}

export interface ChangeSupplierStatusRequest {
  establishmentId: string;
  supplierId: string;
  statusId: string;
}

export interface ListSuppliersRequest {
  establishmentId: string;
  page?: number;
  size?: number;
}

export interface ListSuppliersResponse {
  content: SupplierItemResponse[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface ListSupplierStatusResponse {
  content: SupplierStatusItemResponse[];
}