// service/admin/report/inventoriesReport.ts
import api from "@/service/api";
import { InventoriesReportItem } from "@/types/admin/report";

export async function getInventoriesReport(
    establishmentId: string,
    status?: string,
    startDate?: string,
    endDate?: string
): Promise<InventoriesReportItem[]> {
    let url = `/api/admin/reports/inventories?establishmentId=${establishmentId}`;
    if (status) url += `&status=${status}`;
    if (startDate) url += `&startDate=${startDate}`;
    if (endDate) url += `&endDate=${endDate}`;
    
    const { data } = await api.get<InventoriesReportItem[]>(url);
    return data;
}