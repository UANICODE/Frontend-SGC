// service/admin/cost/createCostCategory.ts
import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import { CreateCostCategoryRequest, CostCategory } from "@/types/admin/cost";

export async function createCostCategory(
    payload: CreateCostCategoryRequest
): Promise<CostCategory> {
    try {
        const { data } = await api.post<CostCategory>(
            "/api/admin/cost-categories/create",
            payload
        );
        return data;
    } catch (error) {
        handleHttpError(error);
        throw error;
    }
}