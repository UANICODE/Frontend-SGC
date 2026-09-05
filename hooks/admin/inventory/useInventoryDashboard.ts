// hooks/admin/inventory/useInventoryDashboard.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { CombinedInventoryAssetDashboard } from "@/types/admin/dashboard";
import { useToast } from "@/ context/ToastContext";
import { getInventoryAssetDashboard } from "@/service/admin/getInventoryAssetDashboard";

export function useInventoryAssetDashboard(establishmentId: string) {
    const { showToast } = useToast();
    const [data, setData] = useState<CombinedInventoryAssetDashboard | null>(null);
    const [loading, setLoading] = useState(false);

    const fetch = useCallback(async () => {
        if (!establishmentId) return;
        try {
            setLoading(true);
            const response = await getInventoryAssetDashboard(establishmentId);
            setData(response);
        } catch (error) {
            if (error instanceof Error) {
                showToast(error.message, "error");
            }
        } finally {
            setLoading(false);
        }
    }, [establishmentId, showToast]);

    useEffect(() => {
        fetch();
    }, [fetch]);

    return { data, loading, refresh: fetch };
}