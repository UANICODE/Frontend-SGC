// hooks/admin/report/useCostsReport.ts
"use client";

import { useState, useCallback } from "react";
import { getCostsReport } from "@/service/report/costsReport";
import { CostsReportItem } from "@/types/admin/report";
import { useToast } from "@/ context/ToastContext";

export function useCostsReport(establishmentId: string) {
    const { showToast } = useToast();
    const [data, setData] = useState<CostsReportItem[]>([]);
    const [loading, setLoading] = useState(false);

    const fetch = useCallback(async (
        startDate?: string,
        endDate?: string,
        categoryId?: string
    ) => {
        if (!establishmentId) return;
        try {
            setLoading(true);
            const response = await getCostsReport(establishmentId, startDate, endDate, categoryId);
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