// hooks/attendant/useUpdateCashRegisterExpense.ts
"use client";

import { useState } from "react";
import { updateCashRegisterExpense } from "@/service/attendant/updateCashRegisterExpense";
import { UpdateExpenseRequest, CashRegisterExpense } from "@/types/attendant/cashRegisterExpense";
import { useToast } from "@/ context/ToastContext";

export function useUpdateCashRegisterExpense() {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);

    const execute = async (request: UpdateExpenseRequest): Promise<CashRegisterExpense> => {
        try {
            setLoading(true);
            const response = await updateCashRegisterExpense(request);
            showToast("Custo atualizado com sucesso!", "success");
            return response;
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