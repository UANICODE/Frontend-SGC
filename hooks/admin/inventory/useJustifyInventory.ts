// hooks/admin/inventory/useJustifyInventory.ts
"use client";

import { useState } from "react";
import { justifyInventory } from "@/service/admin/inventory/justifyInventory";
import { JustifyInventoryRequest, Inventory } from "@/types/admin/inventory";
import { useToast } from "@/ context/ToastContext";

export function useJustifyInventory() {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);

    const execute = async (request: JustifyInventoryRequest): Promise<Inventory> => {
        try {
            setLoading(true);
            const response = await justifyInventory(request);
            showToast("Justificativas salvas com sucesso!", "success");
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