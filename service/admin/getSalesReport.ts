import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import { SalesReportResponse } from "@/types/admin/SalesReportResponse";

export async function getSalesReport(
  establishmentId: string,
  start: string,
  end: string
): Promise<SalesReportResponse> {
  try {
    const { data } = await api.get<SalesReportResponse>(
      "/api/admin/reports/sales",
      {
        params: {
          establishmentId,
          start,
          end,
        },
      }
    );

    return data;
  } catch (error) {
    handleHttpError(error);
  }
}