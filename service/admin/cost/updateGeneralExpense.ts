// service/admin/cost/updateGeneralExpense.ts
import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import { UpdateGeneralExpenseRequest, GeneralExpense } from "@/types/admin/cost";

export async function updateGeneralExpense(
    payload: UpdateGeneralExpenseRequest
): Promise<GeneralExpense> {
    try {
        const { data } = await api.put<GeneralExpense>(
            `/api/admin/general-expenses/${payload.expenseId}`,
            payload
        );
        return data;
    } catch (error) {
        handleHttpError(error);
        throw error;
    }
}