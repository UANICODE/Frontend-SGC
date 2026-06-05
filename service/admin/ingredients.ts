import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";

import {
  CreateIngredientRequest,
  UpdateIngredientRequest,
  DeleteIngredientRequest,
  ListIngredientsRequest,
  ListIngredientsResponse,
} from "@/types/admin/ingredients";

/* ================= LIST ================= */

export async function listIngredients(
  payload: ListIngredientsRequest
): Promise<ListIngredientsResponse> {
  try {
    const { data } = await api.post<ListIngredientsResponse>(
      "/api/admin/ingredients/list",
      payload
    );
    return data;
  } catch (error) {
    handleHttpError(error);
  }
}

/* ================= CREATE ================= */

export async function createIngredient(
  payload: CreateIngredientRequest
): Promise<void> {
  try {
    await api.post("/api/admin/ingredients/create", payload);
  } catch (error) {
    handleHttpError(error);
  }
}

/* ================= UPDATE ================= */

export async function updateIngredient(
  payload: UpdateIngredientRequest
): Promise<void> {
  try {
    await api.put("/api/admin/ingredients", payload);
  } catch (error) {
    handleHttpError(error);
  }
}

/* ================= DELETE ================= */

export async function deleteIngredient(
  payload: DeleteIngredientRequest
): Promise<void> {
  try {
    await api.delete("/api/admin/ingredients/delete", {
      data: payload,
    });
  } catch (error) {
    handleHttpError(error);
  }
}