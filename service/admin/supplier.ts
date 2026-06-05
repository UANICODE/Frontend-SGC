import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import {
  CreateSupplierRequest,
  UpdateSupplierRequest,
  DeleteSupplierRequest,
  ChangeSupplierStatusRequest,
  ListSuppliersRequest,
  ListSuppliersResponse,
  ListSupplierStatusResponse,
} from "@/types/admin/supplier";

export async function createSupplier(data: CreateSupplierRequest) {
  try {
    await api.post("/api/admin/suppliers/create", data);
  } catch (error) {
    handleHttpError(error);
  }
}

export async function updateSupplier(data: UpdateSupplierRequest) {
  try {
    await api.put("/api/admin/suppliers/update", data);
  } catch (error) {
    handleHttpError(error);
  }
}

export async function deleteSupplier(data: DeleteSupplierRequest) {
  try {
    await api.delete("/api/admin/suppliers/delete", { data });
  } catch (error) {
    handleHttpError(error);
  }
}

export async function changeSupplierStatus(
  data: ChangeSupplierStatusRequest
) {
  try {
    await api.put("/api/admin/suppliers/change-status", data);
  } catch (error) {
    handleHttpError(error);
  }
}

export async function listSuppliers(
  data: ListSuppliersRequest
): Promise<ListSuppliersResponse> {
  try {
    const response = await api.post(
      "/api/admin/suppliers/list",
      data
    );
    return response.data;
  } catch (error) {
    handleHttpError(error);
  }
}

export async function listSupplierStatus(): Promise<ListSupplierStatusResponse> {
  try {
    const response = await api.get(
      "/api/admin/supplier-status/list"
    );
    return response.data;
  } catch (error) {
    handleHttpError(error);
  }
}