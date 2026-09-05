// hooks/admin/cost/useGeneralExpensesFilter.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { filterGeneralExpenses } from "@/service/admin/cost/filterGeneralExpenses";
import { GeneralExpenseFilterRequest, GeneralExpenseFilterResponse } from "@/types/admin/cost";
import { useToast } from "@/ context/ToastContext";

export function useGeneralExpensesFilter(establishmentId: string) {
    const { showToast } = useToast();
    const [data, setData] = useState<GeneralExpenseFilterResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState<Omit<GeneralExpenseFilterRequest, 'establishmentId'>>({
        categoryId: undefined,
        period: undefined,
        startDate: undefined,
        endDate: undefined,
        minAmount: undefined,
        maxAmount: undefined,
        page: 0,
        size: 10,
    });

    const fetch = useCallback(async () => {
        if (!establishmentId) return;
        try {
            setLoading(true);
            const response = await filterGeneralExpenses({
                establishmentId,
                ...filters,
            });
            setData(response);
        } catch (error) {
            if (error instanceof Error) {
                showToast(error.message, "error");
            }
        } finally {
            setLoading(false);
        }
    }, [establishmentId, filters, showToast]);

    useEffect(() => {
        fetch();
    }, [fetch]);

    const refresh = useCallback(() => {
        fetch();
    }, [fetch]);

    const goToPage = useCallback((page: number) => {
        setFilters((prev) => ({ ...prev, page }));
    }, []);

    const changePageSize = useCallback((size: number) => {
        setFilters((prev) => ({ ...prev, size, page: 0 }));
    }, []);

    const applyFilters = useCallback((newFilters: Partial<typeof filters>) => {
        setFilters((prev) => ({ ...prev, ...newFilters, page: 0 }));
    }, []);

    const clearFilters = useCallback(() => {
        setFilters({
            categoryId: undefined,
            period: undefined,
            startDate: undefined,
            endDate: undefined,
            minAmount: undefined,
            maxAmount: undefined,

            page: 0,
            size: 10,
        });
    }, []);

    return {
        data,
        loading,
        refresh,
        filters,
        applyFilters,
        clearFilters,
        goToPage,
        changePageSize,
    };
}