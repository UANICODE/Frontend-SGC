// hooks/admin/report/useStockReport.ts
"use client";

import { useState, useCallback } from "react";
import { useToast } from "@/ context/ToastContext";
import { InventoryReportResponse } from "@/types/admin/report.types";
import { generateStockReport } from "@/service/admin/generatestockReport";

export function useStockReport() {
    const { showToast } = useToast();
    const [data, setData] = useState<InventoryReportResponse | null>(null);
    const [loading, setLoading] = useState(false);

    const generate = useCallback(async (establishmentId: string) => {
        if (!establishmentId) {
            showToast("ID do estabelecimento não encontrado", "error");
            return null;
        }

        try {
            setLoading(true);
            const response = await generateStockReport(establishmentId);
            setData(response);
            return response;
        } catch (error) {
            if (error instanceof Error) {
                showToast(error.message, "error");
            }
            return null;
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    return { data, loading, generate };
}