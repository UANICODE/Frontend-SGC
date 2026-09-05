// hooks/admin/cost/useCreateCostCategory.ts
"use client";

import { useState } from "react";
import { createCostCategory } from "@/service/admin/cost/createCostCategory";
import { CreateCostCategoryRequest, CostCategory } from "@/types/admin/cost";
import { useToast } from "@/ context/ToastContext";

export function useCreateCostCategory() {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);

    const execute = async (request: CreateCostCategoryRequest): Promise<CostCategory> => {
        try {
            setLoading(true);
            const response = await createCostCategory(request);
            showToast("Categoria criada com sucesso!", "success");
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