// hooks/admin/asset/useDeleteAssetCategory.ts
"use client";

import { useState } from "react";
import { deleteAssetCategory } from "@/service/admin/asset/deleteAssetCategory";
import { useToast } from "@/ context/ToastContext";

export function useDeleteAssetCategory() {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);

    const execute = async (categoryId: string, establishmentId: string): Promise<void> => {
        try {
            setLoading(true);
            await deleteAssetCategory(categoryId, establishmentId);
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