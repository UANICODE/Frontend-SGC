// service/admin/cost/getCostDashboardSummary.ts
import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import { CostDashboardSummary } from "@/types/admin/cost";

export async function getCostDashboardSummary(
    establishmentId: string,
    startDate?: string,
    endDate?: string
): Promise<CostDashboardSummary> {
    try {
        let url = `/api/admin/cost-dashboard/summary?establishmentId=${establishmentId}`;
        if (startDate) url += `&startDate=${startDate}`;
        if (endDate) url += `&endDate=${endDate}`;
        
        const { data } = await api.get<CostDashboardSummary>(url);
        return data;
    } catch (error) {
        handleHttpError(error);
        throw error;
    }
}