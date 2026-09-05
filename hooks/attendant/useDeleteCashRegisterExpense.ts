// hooks/attendant/useDeleteCashRegisterExpense.ts
"use client";

import { useState } from "react";
import { useToast } from "@/ context/ToastContext";
import { deleteCashRegisterExpense } from "@/service/attendant/eleteCashRegisterExpense";

export function useDeleteCashRegisterExpense() {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);

    const execute = async (expenseId: string): Promise<void> => {
        try {
            setLoading(true);
            await deleteCashRegisterExpense(expenseId);
            showToast("Custo removido com sucesso!", "success");
        } catch (error) {
            if (error instanceof Error) {
                showToast(error.message, "error");
            }
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return { execute, loading };
}