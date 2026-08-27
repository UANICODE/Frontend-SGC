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
 //  console.log("Produtos encontrados", data)
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
/* ================= DEPENDENCIES ================= */

export async function listCategories(
  establishmentId: string
): Promise<CategoryResponse[]> {
  try {
   // console.log("🔍 [listCategories] Chamando API:", `/api/admin/categories/list?establishmentId=${establishmentId}`);
    const { data } = await api.get<CategoryResponse[]>(
      `/api/admin/categories/list?establishmentId=${establishmentId}`
    );
   // console.log("✅ [listCategories] Data:", data);
   // console.log("📊 [listCategories] Quantidade:", data?.length || 0);
    return data || [];
  } catch (error) {
 //   console.error("❌ [listCategories] Erro:", error);
    handleHttpError(error);
    return [];
  }
}

export async function listProductTypes(
  establishmentId: string
): Promise<ProductType[]> {
  try {
   // console.log("🔍 [listProductTypes] Chamando API:", `/api/admin/product-types/${establishmentId}`);
    const { data } = await api.get<ProductType[]>(
      `/api/admin/product-types/${establishmentId}`
    );
  //  console.log("✅ [listProductTypes] Data:", data);
 //   console.log("📊 [listProductTypes] Quantidade:", data?.length || 0);
    return data || [];
  } catch (error) {
   // console.error("❌ [listProductTypes] Erro:", error);
    handleHttpError(error);
    return [];
  }
}

export async function listIngredients(
  establishmentId: string
): Promise<ListIngredientsResponse> {
  try {
 //   console.log("🔍 [listIngredients] Chamando API para:", establishmentId);
    const { data } = await api.post<ListIngredientsResponse>(
      "/api/admin/ingredients/list",
      {
        establishmentId,
        page: 0,
        size: 100,
      }
    );
   // console.log("✅ [listIngredients] Data:", data);
   // console.log("📊 [listIngredients] Quantidade:", data?.content?.length || 0);
    return data || { content: [], page: 0, size: 0, totalElements: 0, totalPages: 0 };
  } catch (error) {
  //  console.error("❌ [listIngredients] Erro:", error);
    handleHttpError(error);
    return { content: [], page: 0, size: 0, totalElements: 0, totalPages: 0 };
  }
}