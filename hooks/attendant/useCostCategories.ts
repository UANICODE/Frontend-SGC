// hooks/attendant/useCostCategories.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { listCostCategories } from "@/service/attendant/listCostCategories";
import { CostCategory } from "@/types/attendant/cashRegisterExpense";
import { useToast } from "@/ context/ToastContext";

export function useCostCategories(establishmentId: string) {
    const { showToast } = useToast();
    const [data, setData] = useState<CostCategory[]>([]);
    const [loading, setLoading] = useState(false);

    const fetch = useCallback(async () => {
        if (!establishmentId) return;
        try {
            setLoading(true);
            const response = await listCostCategories(establishmentId);
            setData(response);
        } catch (error) {
            if (error instanceof Error) {
                showToast(error.message, "error");
            }
        } finally {
            setLoading(false);
        }
    }, [establishmentId, showToast]);

    useEffect(() => {
        fetch();
    }, [fetch]);

    return { data, loading, refresh: fetch };
}