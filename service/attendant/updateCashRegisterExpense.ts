// service/attendant/updateCashRegisterExpense.ts
import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import { UpdateExpenseRequest, CashRegisterExpense } from "@/types/attendant/cashRegisterExpense";

export async function updateCashRegisterExpense(
    payload: UpdateExpenseRequest
): Promise<CashRegisterExpense> {
    try {
        const { data } = await api.put<CashRegisterExpense>(
            "/api/attendant/cash-register-expenses/update",
            payload
        );
        return data;
    } catch (error) {
        handleHttpError(error);
        throw error;
    }
}