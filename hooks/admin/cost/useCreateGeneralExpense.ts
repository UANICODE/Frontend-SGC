// hooks/admin/cost/useCreateGeneralExpense.ts
"use client";

import { useState } from "react";
import { createGeneralExpense } from "@/service/admin/cost/createGeneralExpense";
import { CreateGeneralExpenseRequest, GeneralExpense } from "@/types/admin/cost";
import { useToast } from "@/ context/ToastContext";

export function useCreateGeneralExpense() {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);

    const execute = async (request: CreateGeneralExpenseRequest): Promise<GeneralExpense> => {
        try {
            setLoading(true);
            const response = await createGeneralExpense(request);
            showToast("Custo geral criado com sucesso!", "success");
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