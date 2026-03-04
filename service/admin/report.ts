import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import {
  InventoryReportResponse,
  SalesReportResponse,
} from "@/types/admin/report.types";

export async function generateInventoryReport(
  establishmentId: string
): Promise<InventoryReportResponse> {
  try {
    const res = await api.get("/api/admin/reports/inventory", {
      params: { establishmentId },
    });

    return res.data;
  } catch (error) {
    handleHttpError(error);
  }
}

export async function generateSalesReport(
  establishmentId: string,
  start: string,
  end: string
): Promise<SalesReportResponse> {
  try {
    const res = await api.get("/api/admin/reports/sales", {
      params: { establishmentId, start, end },
    });

    return res.data;
  } catch (error) {
    handleHttpError(error);
  }
}