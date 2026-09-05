// hooks/admin/cost/useActivateCostCategory.ts
"use client";

import { useState } from "react";
import { activateCostCategory } from "@/service/admin/cost/activateCostCategory";
import { useToast } from "@/ context/ToastContext";

export function useActivateCostCategory() {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);

    const execute = async (categoryId: string, establishmentId: string): Promise<void> => {
        try {
            setLoading(true);
            await activateCostCategory(categoryId, establishmentId);
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