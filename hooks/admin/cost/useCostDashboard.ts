// hooks/admin/cost/useCostDashboard.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { getCostDashboardSummary } from "@/service/admin/cost/getCostDashboardSummary";
import { CostDashboardSummary } from "@/types/admin/cost";
import { useToast } from "@/ context/ToastContext";

export function useCostDashboard(establishmentId: string) {
    const { showToast } = useToast();
    const [data, setData] = useState<CostDashboardSummary | null>(null);
    const [loading, setLoading] = useState(false);
    const [period, setPeriod] = useState<{ startDate?: string; endDate?: string }>({});

    const fetch = useCallback(async () => {
        if (!establishmentId) return;
        try {
            setLoading(true);
            const response = await getCostDashboardSummary(
                establishmentId,
                period.startDate,
                period.endDate
            );
            setData(response);
        } catch (error) {
            if (error instanceof Error) {
                showToast(error.message, "error");
            }
        } finally {
            setLoading(false);
        }
    }, [establishmentId, period, showToast]);

    useEffect(() => {
        fetch();
    }, [fetch]);

    const refresh = useCallback(() => {
        fetch();
    }, [fetch]);

    const setPeriodRange = useCallback((startDate?: string, endDate?: string) => {
        setPeriod({ startDate, endDate });
    }, []);

    return { data, loading, refresh, setPeriodRange };
}