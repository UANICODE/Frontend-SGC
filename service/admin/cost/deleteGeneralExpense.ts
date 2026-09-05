// service/admin/cost/deleteGeneralExpense.ts
import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";

export async function deleteGeneralExpense(
    expenseId: string,
    establishmentId: string
): Promise<void> {
    try {
        await api.delete(
            `/api/admin/general-expenses/${expenseId}?establishmentId=${establishmentId}`
        );
    } catch (error) {
        handleHttpError(error);
        throw error;
    }
}