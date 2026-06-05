/* ================= CREATE ================= */

export interface CreateProductTypeRequest {
  establishmentId: string;
  name: string;
  description?: string;
}

export interface CreateProductTypeResponse {
  id: string;
  name: string;
  description?: string;
}

/* ================= UPDATE ================= */

export interface UpdateProductTypeRequest {
  establishmentId: string;
  productTypeId: string;
  name: string;
  description?: string;
}

/* ================= DELETE ================= */

export interface DeleteProductTypeRequest {
  establishmentId: string;
  typeId: string;
}

/* ================= LIST ================= */

export interface ProductTypeResponse {
  id: string;
  name: string;
  description?: string;
}