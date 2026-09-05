// hooks/admin/inventory/useInventory.ts
"use client";

import { useState, useCallback } from "react";
import { getInventory } from "@/service/admin/inventory/getInventory";
import { Inventory } from "@/types/admin/inventory";
import { useToast } from "@/ context/ToastContext";

export function useInventory() {
    const { showToast } = useToast();
    const [data, setData] = useState<Inventory | null>(null);
    const [loading, setLoading] = useState(false);

    const fetch = useCallback(async (inventoryId: string) => {
        try {
            setLoading(true);
            const response = await getInventory(inventoryId);
            setData(response);
            return response;
        } catch (error) {
            if (error instanceof Error) {
                showToast(error.message, "error");
            }
            throw error;
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    return { data, loading, fetch };
}