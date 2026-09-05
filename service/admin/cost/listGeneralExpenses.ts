// service/admin/cost/listGeneralExpenses.ts
import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import { GeneralExpense } from "@/types/admin/cost";

export async function listGeneralExpenses(
    establishmentId: string,
    startDate?: string,
    endDate?: string
): Promise<GeneralExpense[]> {
    try {
        let url = `/api/admin/general-expenses?establishmentId=${establishmentId}`;
        if (startDate) url += `&startDate=${encodeURIComponent(startDate)}`;
        if (endDate) url += `&endDate=${encodeURIComponent(endDate)}`;
        
        const { data } = await api.get<GeneralExpense[]>(url);
        return data;
    } catch (error) {
        handleHttpError(error);
        return [];
    }
}