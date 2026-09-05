// service/admin/cost/getExportData.ts
import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import { ExportRequest, ExportDataResponse } from "@/types/admin/cost";

export async function getExportData(
    payload: ExportRequest
): Promise<ExportDataResponse> {
    try {
        const { data } = await api.post<ExportDataResponse>(
            "/api/admin/export/costs",
            payload
        );
        return data;
    } catch (error) {
        handleHttpError(error);
        throw error;
    }
}