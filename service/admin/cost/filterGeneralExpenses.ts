// service/admin/cost/filterGeneralExpenses.ts
import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import { GeneralExpenseFilterRequest, GeneralExpenseFilterResponse } from "@/types/admin/cost";

export async function filterGeneralExpenses(
    payload: GeneralExpenseFilterRequest
): Promise<GeneralExpenseFilterResponse> {
    try {
        const { data } = await api.post<GeneralExpenseFilterResponse>(
            "/api/admin/general-expenses/filter",
            payload
        );
        return data;
    } catch (error) {
        handleHttpError(error);
        throw error;
    }
}