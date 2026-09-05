// service/admin/cost/listCostCategories.ts
import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import { CostCategory } from "@/types/admin/cost";

export async function listCostCategories(
    establishmentId: string,
    onlyActive?: boolean
): Promise<CostCategory[]> {
    try {
        const { data } = await api.get<CostCategory[]>(
            `/api/admin/cost-categories?establishmentId=${establishmentId}&onlyActive=${onlyActive || false}`
        );
        return data;
    } catch (error) {
        handleHttpError(error);
        return [];
    }
}