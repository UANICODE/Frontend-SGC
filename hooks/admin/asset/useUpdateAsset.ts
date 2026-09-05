// hooks/admin/asset/useUpdateAsset.ts
"use client";

import { useState } from "react";
import { updateAsset } from "@/service/admin/asset/updateAsset";
import { CreateAssetRequest, Asset } from "@/types/admin/asset";
import { useToast } from "@/ context/ToastContext";

export function useUpdateAsset() {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);

    const execute = async (assetId: string, payload: CreateAssetRequest): Promise<Asset> => {
        try {
            setLoading(true);
            const response = await updateAsset(assetId, payload);
            showToast("Ativo atualizado com sucesso!", "success");
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