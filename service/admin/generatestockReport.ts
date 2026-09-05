import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import {
  InventoryReportResponse,
} from "@/types/admin/report.types";

export async function generateStockReport(
    establishmentId: string
): Promise<InventoryReportResponse> {
    try {
        const { data } = await api.get<InventoryReportResponse>(
            "/api/admin/reports/inventory",
            { params: { establishmentId } }
        );
        //console.log("generateStockReport response data:", data); // Log the response data
        return data;
    } catch (error) {
        handleHttpError(error);

    }
}