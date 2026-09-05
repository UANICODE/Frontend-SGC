// hooks/attendant/useCashRegisterExpenses.ts
"use client";

import { useState, useCallback } from "react";
import { listCashRegisterExpenses } from "@/service/attendant/listCashRegisterExpenses";
import { CashRegisterExpense } from "@/types/attendant/cashRegisterExpense";
import { useToast } from "@/ context/ToastContext";

export function useCashRegisterExpenses() {
    const { showToast } = useToast();
    const [data, setData] = useState<CashRegisterExpense[]>([]);
    const [loading, setLoading] = useState(false);

    const fetch = useCallback(async (cashRegisterId: string) => {
        try {
            setLoading(true);
            const response = await listCashRegisterExpenses(cashRegisterId);
            setData(response);
        } catch (error) {
            if (error instanceof Error) {
                showToast(error.message, "error");
            }
            throw error;
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    return { data, loading, fetch };
}