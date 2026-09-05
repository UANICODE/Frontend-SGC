// service/admin/cost/createGeneralExpense.ts
import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import { CreateGeneralExpenseRequest, GeneralExpense } from "@/types/admin/cost";

export async function createGeneralExpense(
    payload: CreateGeneralExpenseRequest
): Promise<GeneralExpense> {
    try {
        const { data } = await api.post<GeneralExpense>(
            "/api/admin/general-expenses/create",
            payload
        );
        return data;
    } catch (error) {
        handleHttpError(error);
        throw error;
    }
}