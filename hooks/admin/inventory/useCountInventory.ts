// hooks/admin/inventory/useCountInventory.ts
"use client";

import { useState } from "react";
import { countInventory } from "@/service/admin/inventory/countInventory";
import { CountInventoryRequest, Inventory } from "@/types/admin/inventory";
import { useToast } from "@/ context/ToastContext";

export function useCountInventory() {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);

    const execute = async (request: CountInventoryRequest): Promise<Inventory> => {
        try {
            setLoading(true);
            const response = await countInventory(request);
            showToast("Contagem realizada com sucesso!", "success");
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