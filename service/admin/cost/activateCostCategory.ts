// service/admin/cost/activateCostCategory.ts
import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";

export async function activateCostCategory(
    categoryId: string,
    establishmentId: string
): Promise<void> {
    try {
        await api.patch(
            `/api/admin/cost-categories/${categoryId}/activate?establishmentId=${establishmentId}`
        );
    } catch (error) {
        handleHttpError(error);
        throw error;
    }
}