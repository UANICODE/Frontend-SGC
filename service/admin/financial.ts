import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import { FinancialDashboardData } from "@/types/admin/financial";

export async function getFinancialDashboard(
    establishmentId: string
): Promise<FinancialDashboardData> {
    try {
        const { data } = await api.get<FinancialDashboardData>(
            `/api/admin/financial/dashboard/${establishmentId}`
        );
        return data;
    } catch (error) {
        handleHttpError(error);
        throw error;
    }
}