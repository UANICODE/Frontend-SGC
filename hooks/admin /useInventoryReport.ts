"use client";

import { useEffect, useState } from "react";
import { getInventoryReport } from "@/service/admin/getInventoryReport";
import { InventoryReportResponse } from "@/types/admin/InventoryReportResponse";
import { useToast } from "@/ context/ToastContext";


export function useInventoryReport(establishmentId: string) {
  const { showToast } = useToast();

  const [data, setData] = useState<InventoryReportResponse | null>(null);
  const [loading, setLoading] = useState(false);

  async function fetchReport() {
    try {
      setLoading(true);

      const response = await getInventoryReport(establishmentId);
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