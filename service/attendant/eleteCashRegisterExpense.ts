// service/attendant/deleteCashRegisterExpense.ts
import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";

export async function deleteCashRegisterExpense(
    expenseId: string
): Promise<void> {
    try {
        await api.delete(`/api/attendant/cash-register-expenses/${expenseId}`);
    } catch (error) {
        handleHttpError(error);
        throw error;
    }
}