/* ================= CREATE ================= */

export interface CreateProductCategoryRequest {
  establishmentId: string;
  name: string;
  description?: string;
}

export interface CreateProductCategoryResponse {
  id: string;
  name: string;
  description?: string;
  establishmentId: string;
  createdAt: string;
}

/* ================= UPDATE ================= */

export interface UpdateProductCategoryRequest {
  establishmentId: string;
  categoryId: string;
  name: string;
  description?: string;
}

export interface UpdateProductCategoryResponse {
  id: string;
  name: string;
  description?: string;
  establishmentId: string;
  updatedAt: string;
}

/* ================= DELETE ================= */

export interface DeleteProductCategoryRequest {
  establishmentId: string;
  categoryId: string;
}

export interface DeleteProductCategoryResponse {
  categoryId: string;
  message: string;
}

/* ================= LIST ================= */
/* (estrutura paginada padrão do sistema) */

/* ================= LIST ================= */

export interface CategoryItemResponse {
  id: string;
  name: string;
  description?: string;
  establishmentId: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ListCategoriesRequest {
  establishmentId: string;
  name?: string; // filtro opcional
}

export type ListCategoriesResponse = CategoryItemResponse[]; // array direto, sem paginação


