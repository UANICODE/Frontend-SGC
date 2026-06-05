/* ================= LIST ================= */
export interface ListProductsRequest {
  establishmentId: string;
  page?: number;
  size?: number;
  name?: string;
  categoryId?: string;
  productTypeId?: string;
  minPrice?: number;
  maxPrice?: number;
  active?: boolean;
  controlsStock?: boolean;
  allowNegativeStock?: boolean;
}

export interface ProductItemResponse {
  id: string;
  name: string;
  description?: string;
  imageurl?: string;
  price: number;
  active: boolean;
  controlsStock: boolean;
  allowNegativeStock: boolean;
  stockQuantity?: number;
  categoryId: string;
  categoryName?: string;
  productTypeId: string;
  productTypeName?: string;
  ingredients?: IngredientItem[]; // ingredientes do produto composto
  createdAt?: string;
  updatedAt?: string;
   isFixedPortion: boolean;
  portionQuantity?: number | null;
  isWeightBased: boolean;
  pricePerGram?: number;
  minWeight?: number;
}

export interface ListProductsResponse {
  content: ProductItemResponse[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

/* ================= CREATE SIMPLE ================= */
export interface CreateProductRequest {
  establishmentId: string;
  categoryId: string;
  productTypeId: string;
  name: string;
  description?: string;
  imageurl?: string;
  price: number;
  controlsStock: boolean;
  allowNegativeStock: boolean;
  active: boolean;
  initialStockQuantity: number;
  isFixedPortion?: boolean;
  portionQuantity?: number | null;
   isWeightBased?: boolean;
  pricePerGram?: number | null;
  minWeight?: number | null;
}

export interface CreateProductResponse {
  productId: string;
  name: string;
  price: number;
  active: boolean;
  stockQuantity: number;
}

/* ================= INGREDIENT ================= */
export interface IngredientItem {
  ingredientId: string;
  ingredientName: string;
  quantityUsed: number;
}

/* ================= CREATE COMPOSITE ================= */
export interface CreateCompositeProductRequest {
  establishmentId: string;
  categoryId: string;
  productTypeId: string;
  name: string;
  description?: string;
  imageurl?: string;
  price: number;
  controlsStock: boolean;
  allowNegativeStock: boolean;
  active: boolean;
  ingredients: IngredientItem[];
}

export interface CreateCompositeProductResponse {
  productId: string;
  name: string;
  price: number;
  active: boolean;
}

/* ================= UPDATE ================= */
export interface UpdateProductRequest {
  establishmentId: string;
  productId: string;
  categoryId: string;
  productTypeId: string;
  name: string;
  description?: string;
  imageurl?: string;
  price: number;
  controlsStock: boolean;
  allowNegativeStock: boolean;
  active: boolean;
   isFixedPortion: boolean;
  portionQuantity?: number | null;
   isWeightBased: boolean;
  pricePerGram?: number | null;
  minWeight?: number | null;
  ingredients?: IngredientItem[] | null; // null ou vazio = produto simples
}


export interface IngredientForBackend {
  ingredientId: string;
  quantityUsed: number;
}

export interface UpdateProductResponse {
  productId: string;
  name: string;
  price: number;
  active: boolean;
}

/* ================= DEPENDENCIES ================= */
export interface CategoryResponse {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductType {
  id: string;
  name: string;
  description?: string;
}

export interface IngredientItemResponse {
  id: string;
  name: string;
  unit?: string;
  statusId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ListIngredientsResponse {
  content: IngredientItemResponse[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface StockMovement {
  productName: string;
  movementType: string;
  quantity: number;
  quantityBefore: number;
  quantityAfter: number;
  responsibleUser: string;
  createdAt: string;
}