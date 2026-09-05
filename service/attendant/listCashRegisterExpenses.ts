// service/attendant/listCashRegisterExpenses.ts
import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import { CashRegisterExpense } from "@/types/attendant/cashRegisterExpense";

export async function listCashRegisterExpenses(
    cashRegisterId: string
): Promise<CashRegisterExpense[]> {
    try {
        const { data } = await api.get<CashRegisterExpense[]>(
            `/api/attendant/cash-register-expenses/${cashRegisterId}`
        );
        return data;
    } catch (error) {
        handleHttpError(error);
        throw error;
    }
}