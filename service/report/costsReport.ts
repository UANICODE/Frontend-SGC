// service/admin/report/costsReport.ts
import api from "@/service/api";
import { CostsReportItem } from "@/types/admin/report";

export async function getCostsReport(
    establishmentId: string,
    startDate?: string,
    endDate?: string,
    categoryId?: string
): Promise<CostsReportItem[]> {
    let url = `/api/admin/reports/costs?establishmentId=${establishmentId}`;
    if (startDate) url += `&startDate=${startDate}`;
    if (endDate) url += `&endDate=${endDate}`;
    if (categoryId) url += `&categoryId=${categoryId}`;
    
    const { data } = await api.get<CostsReportItem[]>(url);
    return data;
}