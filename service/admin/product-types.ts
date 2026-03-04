import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import {
  CreateProductTypeRequest,
  CreateProductTypeResponse,
  UpdateProductTypeRequest,
  DeleteProductTypeRequest,
  ProductTypeResponse,
} from "@/types/admin/product-types";

/* ================= LIST ================= */

export async function listProductTypes(
  establishmentId: string
): Promise<ProductTypeResponse[]> {
  try {
    const { data } = await api.get<ProductTypeResponse[]>(
      `/api/admin/product-types/${establishmentId}`
    );

    return data;
  } catch (error) {
    handleHttpError(error);
  }
}

/* ================= CREATE ================= */

export async function createProductType(
  payload: CreateProductTypeRequest
): Promise<CreateProductTypeResponse> {
  try {
    const { data } = await api.post<CreateProductTypeResponse>(
      "/api/admin/product-types/create",
      payload
    );

    return data;
  } catch (error) {
    handleHttpError(error);
  }
}

/* ================= UPDATE ================= */

export async function updateProductType(
  payload: UpdateProductTypeRequest
): Promise<void> {
  try {
    await api.put(
      "/api/admin/product-types/update",
      payload
    );
  } catch (error) {
    handleHttpError(error);
  }
}

/* ================= DELETE ================= */

export async function deleteProductType(
  payload: DeleteProductTypeRequest
): Promise<void> {
  try {
    await api.delete(
      "/api/admin/product-types/delete",
      { data: payload }
    );
  } catch (error) {
    handleHttpError(error);
  }
}