import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";

import {
  ListProductsRequest,
  ListProductsResponse,
  CreateProductRequest,
  CreateProductResponse,
  CreateCompositeProductRequest,
  CreateCompositeProductResponse,
  UpdateProductRequest,
  UpdateProductResponse,
  CategoryResponse,
  ProductType,
  ListIngredientsResponse,
} from "@/types/admin/product";

/* ================= LIST ================= */

export async function listProducts(
  payload: ListProductsRequest
): Promise<ListProductsResponse> {
  try {
    const { data } = await api.post<ListProductsResponse>(
      "/api/admin/products/list",
      payload
    );
    return data;
  } catch (error) {
    handleHttpError(error);
  }
}

/* ================= CREATE SIMPLE ================= */

export async function createProduct(
  payload: CreateProductRequest
): Promise<CreateProductResponse> {
  try {
    const { data } = await api.post<CreateProductResponse>(
      "/api/admin/products/create",
      payload
    );
    return data;
  } catch (error) {
    handleHttpError(error);
  }
}

/* ================= CREATE COMPOSITE ================= */

export async function createCompositeProduct(
  payload: CreateCompositeProductRequest
): Promise<CreateCompositeProductResponse> {
  try {
    const { data } = await api.post<CreateCompositeProductResponse>(
      "/api/admin/products/composite",
      payload
    );
    return data;
  } catch (error) {
    handleHttpError(error);
  }
}

/* ================= UPDATE ================= */

export async function updateProduct(
  payload: UpdateProductRequest
): Promise<UpdateProductResponse> {
  try {
    const { data } = await api.put<UpdateProductResponse>(
      "/api/admin/products/update",
      payload
    );
    return data;
  } catch (error) {
    handleHttpError(error);
  }
}

/* ================= DELETE ================= */

export async function deleteProduct(
  establishmentId: string,
  productId: string
): Promise<void> {
  try {
    await api.delete(
      `/api/admin/products/delete/${establishmentId}/${productId}`
    );
  } catch (error) {
    handleHttpError(error);
  }
}

/* ================= DEPENDENCIES ================= */

export async function listCategories(
  establishmentId: string
): Promise<CategoryResponse[]> {
  try {
    const { data } = await api.post<CategoryResponse[]>(
      "/api/admin/categories/list",
      { establishmentId }
    );
    return data;
  } catch (error) {
    handleHttpError(error);
  }
}

export async function listProductTypes(
  establishmentId: string
): Promise<ProductType[]> {
  try {
    const { data } = await api.get<ProductType[]>(
      `/api/admin/product-types/${establishmentId}`
    );
    return data;
  } catch (error) {
    handleHttpError(error);
  }
}

export async function listIngredients(
  establishmentId: string
): Promise<ListIngredientsResponse> {
  try {
    const { data } = await api.post<ListIngredientsResponse>(
      "/api/admin/ingredients/list",
      {
        establishmentId,
        page: 0,
        size: 100,
      }
    );
    return data;
  } catch (error) {
    handleHttpError(error);
  }
}