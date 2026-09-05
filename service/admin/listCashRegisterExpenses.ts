// service/admin/listCashRegisterExpenses.ts
import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import { CashRegisterExpense } from "@/types/attendant/cashRegisterExpense";

export async function listCashRegisterExpensesForAdmin(
    cashRegisterId: string
): Promise<CashRegisterExpense[]> {
    try {
        const { data } = await api.get<CashRegisterExpense[]>(
            `/api/admin/cash-register-expenses/${cashRegisterId}`
         
        );
       // console.log("listCashRegisterExpensesForAdmin", data);
        return data;
        
    } catch (error) {
        handleHttpError(error);
        return [];
    }
}