// hooks/admin/asset/useCreateAssetCategory.ts
"use client";

import { useState } from "react";
import { createAssetCategory } from "@/service/admin/asset/createAssetCategory";
import { AssetCategory } from "@/types/admin/asset";
import { useToast } from "@/ context/ToastContext";

export function useCreateAssetCategory() {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);

    const execute = async (payload: { establishmentId: string; name: string; description?: string }): Promise<AssetCategory> => {
        try {
            setLoading(true);
            const response = await createAssetCategory(payload);
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