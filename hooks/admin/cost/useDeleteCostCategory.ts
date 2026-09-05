// hooks/admin/cost/useDeleteCostCategory.ts
"use client";

import { useState } from "react";
import { deleteCostCategory } from "@/service/admin/cost/deleteCostCategory";
import { useToast } from "@/ context/ToastContext";

export function useDeleteCostCategory() {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);

    const execute = async (categoryId: string, establishmentId: string): Promise<void> => {
        try {
            setLoading(true);
            await deleteCostCategory(categoryId, establishmentId);
            showToast("Categoria removida com sucesso!", "success");
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