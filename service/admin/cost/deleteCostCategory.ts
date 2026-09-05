// service/admin/cost/deleteCostCategory.ts
import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";

export async function deleteCostCategory(
    categoryId: string,
    establishmentId: string
): Promise<void> {
    try {
        await api.delete(
            `/api/admin/cost-categories/${categoryId}?establishmentId=${establishmentId}`
        );
    } catch (error) {
        handleHttpError(error);
        throw error;
    }
}