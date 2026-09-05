// service/admin/cost/updateCostCategory.ts
import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import { UpdateCostCategoryRequest, CostCategory } from "@/types/admin/cost";

export async function updateCostCategory(
    payload: UpdateCostCategoryRequest
): Promise<CostCategory> {
    try {
        // Support requests where the identifier may be named differently in the request type
        const id = (payload as any).categoryId ?? (payload as any).id;
        const { data } = await api.put<CostCategory>(
            `/api/admin/cost-categories/${payload.categoryId}`,
            payload
        );
        return data;
    } catch (error) {
        handleHttpError(error);
        throw error;
    }
}