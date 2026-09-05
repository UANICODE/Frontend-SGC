// hooks/admin/asset/useDisposeAsset.ts
"use client";

import { useState } from "react";
import { disposeAsset } from "@/service/admin/asset/disposeAsset";
import { DisposeAssetRequest } from "@/types/admin/asset";
import { useToast } from "@/ context/ToastContext";

export function useDisposeAsset() {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);

    const execute = async (payload: DisposeAssetRequest): Promise<void> => {
        try {
            setLoading(true);
            await disposeAsset(payload);
            showToast("Baixa realizada com sucesso!", "success");
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