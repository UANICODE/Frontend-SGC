"use client";

import { useEffect, useState } from "react";
import { getSalesReport } from "@/service/admin/getSalesReport";
import { SalesReportResponse } from "@/types/admin/SalesReportResponse";
import { useToast } from "@/ context/ToastContext";


export function useSalesReport(establishmentId: string) {
  const { showToast } = useToast();

  const [data, setData] = useState<SalesReportResponse | null>(null);
  const [loading, setLoading] = useState(false);

  async function fetchReport() {
    try {
      setLoading(true);

      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 30);

      const response = await getSalesReport(
        establishmentId,
        start.toISOString(),
        end.toISOString()
      );

      setData(response);
    } catch (error) {
      if (error instanceof Error) {
        showToast(error.message, "error");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchReport();
  }, [establishmentId]);

  return { data, loading, refresh: fetchReport };
}