/* ============================================================
   INGREDIENT ITEM (usado no ListIngredientsResponse)
   ============================================================ */

export interface IngredientItemResponse {
  id: string;
  establishmentId: string;
  name: string;
  unitName: string;
  unitSymbol: string;
  quantity: number;
  minimumLimit: number;
  statusName: string;
}
/* ============================================================
   CREATE
   Espelhando:
   record CreateIngredientRequest(
      UUID establishmentId,
      String name,
      String unitName,
      String unitSymbol,
      BigDecimal quantity,
      BigDecimal minimumLimit,
      UUID statusId
   )
   ============================================================ */

export interface CreateIngredientRequest {
  establishmentId: string;
  name: string;
  unitName: string;
  unitSymbol: string;
  quantity: number;
  minimumLimit: number
}

/* ============================================================
   UPDATE
   Espelhando:
   record UpdateIngredientRequest(
      UUID establishmentId,
      UUID ingredientId,
      String name,
      String unitName,
      String unitSymbol,
      BigDecimal quantity,
      BigDecimal minimumLimit,
      UUID statusId
   )
   ============================================================ */

export interface UpdateIngredientRequest {
  establishmentId: string;
  ingredientId: string;
  name?: string;
  unitName?: string;
  unitSymbol?: string;
  quantity?: number;
  minimumLimit?: number
}

/* ============================================================
   DELETE
   Espelhando:
   record DeleteIngredientRequest(
      UUID establishmentId,
      UUID ingredientId
   )
   ============================================================ */

export interface DeleteIngredientRequest {
  establishmentId: string;
  ingredientId: string;
}

/* ============================================================
   LIST REQUEST
   Espelhando:
   record ListIngredientsRequest(
      UUID establishmentId,
      String name,
      UUID statusId,
      Integer page,
      Integer size
   )
   ============================================================ */

export interface ListIngredientsRequest {
  establishmentId: string;
  name?: string;
  statusId?: string;
  page: number;
  size: number;
}

/* ============================================================
   LIST RESPONSE
   Espelhando:
   record ListIngredientsResponse(
      List<IngredientItemResponse> content,
      int page,
      int size,
      long totalElements,
      int totalPages
   )
   ============================================================ */

export interface ListIngredientsResponse {
  content: IngredientItemResponse[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}