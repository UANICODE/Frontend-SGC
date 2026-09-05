// hooks/admin/cost/useUpdateCostCategory.ts
"use client";

import { useState } from "react";
import { updateCostCategory } from "@/service/admin/cost/updateCostCategory";
import { UpdateCostCategoryRequest, CostCategory } from "@/types/admin/cost";
import { useToast } from "@/ context/ToastContext";

export function useUpdateCostCategory() {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);

    const execute = async (request: UpdateCostCategoryRequest): Promise<CostCategory> => {
        try {
            setLoading(true);
            const response = await updateCostCategory(request);
            showToast("Categoria atualizada com sucesso!", "success");
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