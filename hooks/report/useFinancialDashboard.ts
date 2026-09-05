"use client";

import { useState, useCallback, useEffect } from "react";
import { useToast } from "@/ context/ToastContext";
import { FinancialDashboardData } from "@/types/admin/financial";
import { getFinancialDashboard } from "@/service/admin/financial";

export function useFinancialDashboard(establishmentId: string) {
    const { showToast } = useToast();
    const [data, setData] = useState<FinancialDashboardData | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchDashboard = useCallback(async () => {
        if (!establishmentId) {
            return;
        }

        try {
            setLoading(true);
            const response = await getFinancialDashboard(establishmentId);
            setData(response);
        } catch (error) {
            if (error instanceof Error) {
                showToast(error.message, "error");
            }
            setData(null);
        } finally {
            setLoading(false);
        }
    }, [establishmentId, showToast]);

    useEffect(() => {
        if (establishmentId) {
            fetchDashboard();
        }
    }, [establishmentId, fetchDashboard]);

    return { data, loading, refresh: fetchDashboard };
}