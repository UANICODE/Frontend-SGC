// hooks/admin/report/usePurchasesReport.ts
"use client";

import { useState, useCallback } from "react";
import { getPurchasesReport } from "@/service/report/purchasesReport";
import { useToast } from "@/ context/ToastContext";
import { PurchaseFilterRequest } from "@/types/admin/purchase";

type PurchasesReportData = Awaited<ReturnType<typeof getPurchasesReport>>;

export function usePurchasesReport(establishmentId: string) {
    const { showToast } = useToast();
    const [data, setData] = useState<PurchasesReportData | null>(null);
    const [loading, setLoading] = useState(false);

    const fetch = useCallback(async (filters: Partial<PurchaseFilterRequest>) => {
        if (!establishmentId) return null;
        try {
            setLoading(true);
            const response = await getPurchasesReport({
                establishmentId,
                ...filters,
            });
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