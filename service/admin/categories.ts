import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";

import {
  CreateProductCategoryRequest,
  CreateProductCategoryResponse,
  UpdateProductCategoryRequest,
  UpdateProductCategoryResponse,
  DeleteProductCategoryRequest,
  DeleteProductCategoryResponse,
  ListCategoriesRequest,
  ListCategoriesResponse,
} from "@/types/admin/categories";

/* ================= LIST ================= */

export async function listCategories(
  payload: ListCategoriesRequest
): Promise<ListCategoriesResponse> {
  try {
    const { data } = await api.post<ListCategoriesResponse>(
      "/api/admin/categories/list",
      payload
    );
    return data;
  } catch (error) {
    handleHttpError(error);
  }
}

/* ================= CREATE ================= */

export async function createCategory(
  payload: CreateProductCategoryRequest
): Promise<CreateProductCategoryResponse> {
  try {
    const { data } = await api.post<CreateProductCategoryResponse>(
      "/api/admin/categories/create",
      payload
    );
    return data;
  } catch (error) {
    handleHttpError(error);
  }
}

/* ================= UPDATE ================= */

export async function updateCategory(
  payload: UpdateProductCategoryRequest
): Promise<UpdateProductCategoryResponse> {
  try {
    const { data } = await api.put<UpdateProductCategoryResponse>(
      "/api/admin/categories",
      payload
    );
    return data;
  } catch (error) {
    handleHttpError(error);
  }
}

/* ================= DELETE ================= */

export async function deleteCategory(
  payload: DeleteProductCategoryRequest
): Promise<DeleteProductCategoryResponse> {
  try {
    const { data } = await api.delete<DeleteProductCategoryResponse>(
      "/api/admin/categories/delete",
      { data: payload }
    );
    return data;
  } catch (error) {
    handleHttpError(error);
  }
}