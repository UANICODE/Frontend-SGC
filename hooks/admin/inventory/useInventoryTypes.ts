// hooks/admin/inventory/useInventoryTypes.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { listInventoryTypes } from "@/service/admin/inventory/listInventoryTypes";
import { InventoryType } from "@/types/admin/inventory";
import { useToast } from "@/ context/ToastContext";

export function useInventoryTypes() {
    const { showToast } = useToast();
    const [data, setData] = useState<InventoryType[]>([]);
    const [loading, setLoading] = useState(false);

    const fetch = useCallback(async () => {
        try {
            setLoading(true);
            const response = await listInventoryTypes();
            setData(response);
        } catch (error) {
            if (error instanceof Error) {
                showToast(error.message, "error");
            }
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    useEffect(() => {
        fetch();
    }, [fetch]);

    return { data, loading, refresh: fetch };
}