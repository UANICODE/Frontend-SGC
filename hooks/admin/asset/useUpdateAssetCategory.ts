// hooks/admin/asset/useUpdateAssetCategory.ts
"use client";

import { useState } from "react";
import { updateAssetCategory } from "@/service/admin/asset/updateAssetCategory";
import { AssetCategory } from "@/types/admin/asset";
import { useToast } from "@/ context/ToastContext";

export function useUpdateAssetCategory() {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);

    const execute = async (categoryId: string, payload: { establishmentId: string; name: string; description?: string }): Promise<AssetCategory> => {
        try {
            setLoading(true);
            const response = await updateAssetCategory(categoryId, payload);
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