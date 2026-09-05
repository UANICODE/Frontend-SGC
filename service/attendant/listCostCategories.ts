
import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import { CostCategory } from "@/types/attendant/cashRegisterExpense";

export async function listCostCategories(
    establishmentId: string
): Promise<CostCategory[]> {
    try {
        const { data } = await api.get<CostCategory[]>(
            `/api/attendant/cost-categories?establishmentId=${establishmentId}`
        );
        return data;
    } catch (error) {
        handleHttpError(error);
        return [];
    }
}