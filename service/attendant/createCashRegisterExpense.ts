// service/attendant/createCashRegisterExpense.ts
import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import { CreateExpenseRequest, CashRegisterExpense } from "@/types/attendant/cashRegisterExpense";

export async function createCashRegisterExpense(
    payload: CreateExpenseRequest
): Promise<CashRegisterExpense> {
    try {
        const { data } = await api.post<CashRegisterExpense>(
            "/api/attendant/cash-register-expenses/create",
            payload
        );
        return data;
    } catch (error) {
        handleHttpError(error);
        throw error;
    }
}