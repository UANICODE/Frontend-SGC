// hooks/admin/cost/useCostCategories.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { listCostCategories } from "@/service/admin/cost/listCostCategories";
import { CostCategory } from "@/types/admin/cost";
import { useToast } from "@/ context/ToastContext";

export function useCostCategories(establishmentId: string, onlyActive: boolean = true) {
    const { showToast } = useToast();
    const [data, setData] = useState<CostCategory[]>([]);
    const [loading, setLoading] = useState(false);

    const fetch = useCallback(async () => {
        if (!establishmentId) return;
        try {
            setLoading(true);
            const response = await listCostCategories(establishmentId, onlyActive);
            setData(response);
        } catch (error) {
            if (error instanceof Error) {
                showToast(error.message, "error");
            }
        } finally {
            setLoading(false);
        }
    }, [establishmentId, onlyActive, showToast]);

    useEffect(() => {
        fetch();
    }, [fetch]);

    return { data, loading, refresh: fetch };
}