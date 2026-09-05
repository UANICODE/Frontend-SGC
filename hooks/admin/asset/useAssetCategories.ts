// hooks/admin/asset/useAssetCategories.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { listAssetCategories } from "@/service/admin/asset/listAssetCategories";
import { AssetCategory } from "@/types/admin/asset";
import { useToast } from "@/ context/ToastContext";

export function useAssetCategories(establishmentId: string, onlyActive: boolean = false) {
    const { showToast } = useToast();
    const [data, setData] = useState<AssetCategory[]>([]);
    const [loading, setLoading] = useState(false);

    const fetch = useCallback(async () => {
        if (!establishmentId) return;
        try {
            setLoading(true);
            const response = await listAssetCategories(establishmentId, onlyActive);
            setData(response);
        } catch (error) {
            if (error instanceof Error) {
                showToast(error.message, "error");
            }
        } finally {
            setLoading(false);
        }
    }, [establishmentId, onlyActive, showToast]);

    useEffect(() => {
        fetch();
    }, [fetch]);

    return { data, loading, refresh: fetch };
}