
"use client";

import { useState } from "react";
import { updateGeneralExpense } from "@/service/admin/cost/updateGeneralExpense";
import { UpdateGeneralExpenseRequest, GeneralExpense } from "@/types/admin/cost";
import { useToast } from "@/ context/ToastContext";

export function useUpdateGeneralExpense() {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);

    const execute = async (request: UpdateGeneralExpenseRequest): Promise<GeneralExpense> => {
        try {
            setLoading(true);
            const response = await updateGeneralExpense(request);
            showToast("Custo geral atualizado com sucesso!", "success");
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