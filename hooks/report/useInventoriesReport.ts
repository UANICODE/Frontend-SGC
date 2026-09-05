// hooks/admin/report/useInventoriesReport.ts
"use client";

import { useState, useCallback } from "react";
import { getInventoriesReport } from "@/service/report/inventoriesReport";
import { InventoriesReportItem } from "@/types/admin/report";
import { useToast } from "@/ context/ToastContext";

export function useInventoriesReport(establishmentId: string) {
    const { showToast } = useToast();
    const [data, setData] = useState<InventoriesReportItem[]>([]);
    const [loading, setLoading] = useState(false);

    const fetch = useCallback(async (
        status?: string,
        startDate?: string,
        endDate?: string
    ) => {
        if (!establishmentId) return;
        try {
            setLoading(true);
            const response = await getInventoriesReport(establishmentId, status, startDate, endDate);
            setData(response);
            return response;
        } catch (error) {
            if (error instanceof Error) {
                showToast(error.message, "error");
            }
            throw error;
        } finally {
            setLoading(false);
        }
    }, [establishmentId, showToast]);

    return { data, loading, fetch };
}