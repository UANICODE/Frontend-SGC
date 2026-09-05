// hooks/admin/cost/useDeleteGeneralExpense.ts
"use client";

import { useState } from "react";
import { deleteGeneralExpense } from "@/service/admin/cost/deleteGeneralExpense";
import { useToast } from "@/ context/ToastContext";

export function useDeleteGeneralExpense() {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);

    const execute = async (expenseId: string, establishmentId: string): Promise<void> => {
        try {
            setLoading(true);
            await deleteGeneralExpense(expenseId, establishmentId);
            showToast("Custo geral removido com sucesso!", "success");
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