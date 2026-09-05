// hooks/admin/report/useAssetsReport.ts
"use client";

import { useState, useCallback } from "react";
import { AssetsReportItem } from "@/types/admin/report";
import { useToast } from "@/ context/ToastContext";
import { getAssetsReport } from "@/service/report/assetsReport";

export function useAssetsReport(establishmentId: string) {
    const { showToast } = useToast();
    const [data, setData] = useState<AssetsReportItem[]>([]);
    const [loading, setLoading] = useState(false);

    const fetch = useCallback(async (status?: string) => {
        if (!establishmentId) return;
        try {
            setLoading(true);
            const response = await getAssetsReport(establishmentId, status);
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