// hooks/admin/cost/useGeneralExpenses.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { listGeneralExpenses } from "@/service/admin/cost/listGeneralExpenses";
import { GeneralExpense } from "@/types/admin/cost";
import { useToast } from "@/ context/ToastContext";

export function useGeneralExpenses(
    establishmentId: string,
    startDate?: string,
    endDate?: string
) {
    const { showToast } = useToast();
    const [data, setData] = useState<GeneralExpense[]>([]);
    const [loading, setLoading] = useState(false);

    const fetch = useCallback(async () => {
        if (!establishmentId) return;
        try {
            setLoading(true);
            const response = await listGeneralExpenses(establishmentId, startDate, endDate);
            setData(response);
        } catch (error) {
            if (error instanceof Error) {
                showToast(error.message, "error");
            }
        } finally {
            setLoading(false);
        }
    }, [establishmentId, startDate, endDate, showToast]);

    useEffect(() => {
        fetch();
    }, [fetch]);

    return { data, loading, refresh: fetch };
}