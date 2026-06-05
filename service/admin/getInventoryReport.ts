import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import { InventoryReportResponse } from "@/types/admin/InventoryReportResponse";

export async function getInventoryReport(
  establishmentId: string
): Promise<InventoryReportResponse> {
  try {
    const { data } = await api.get<InventoryReportResponse>(
      "/api/admin/reports/inventory",
      {
        params: { establishmentId },
      }
    );

    return data;
  } catch (error) {
    handleHttpError(error);
  }
}