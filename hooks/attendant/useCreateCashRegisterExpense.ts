// hooks/attendant/useCreateCashRegisterExpense.ts
"use client";

import { useState } from "react";
import { createCashRegisterExpense } from "@/service/attendant/createCashRegisterExpense";
import { CreateExpenseRequest, CashRegisterExpense } from "@/types/attendant/cashRegisterExpense";
import { useToast } from "@/ context/ToastContext";

export function useCreateCashRegisterExpense() {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);

    const execute = async (request: CreateExpenseRequest): Promise<CashRegisterExpense> => {
        try {
            setLoading(true);
            const response = await createCashRegisterExpense(request);
            showToast("Custo registrado com sucesso!", "success");
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