// hooks/admin/asset/useCreateAsset.ts
"use client";

import { useState } from "react";
import { createAsset } from "@/service/admin/asset/createAsset";
import { CreateAssetRequest, Asset } from "@/types/admin/asset";
import { useToast } from "@/ context/ToastContext";

export function useCreateAsset() {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);

    const execute = async (payload: CreateAssetRequest): Promise<Asset> => {
        try {
            setLoading(true);
            const response = await createAsset(payload);
            showToast("Ativo criado com sucesso!", "success");
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