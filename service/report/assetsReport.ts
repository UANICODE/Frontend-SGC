// service/admin/report/assetsReport.ts
import api from "@/service/api";
import { AssetsReportItem } from "@/types/admin/report";

export async function getAssetsReport(
    establishmentId: string,
    status?: string
): Promise<AssetsReportItem[]> {
    const url = `/api/admin/reports/assets?establishmentId=${establishmentId}${status ? `&status=${status}` : ''}`;
    const { data } = await api.get<AssetsReportItem[]>(url);
    return data;
}