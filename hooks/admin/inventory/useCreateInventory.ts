// hooks/admin/inventory/useCreateInventory.ts
"use client";

import { useState } from "react";
import { createInventory } from "@/service/admin/inventory/createInventory";
import { CreateInventoryRequest, Inventory } from "@/types/admin/inventory";
import { useToast } from "@/ context/ToastContext";

export function useCreateInventory() {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);

    const execute = async (request: CreateInventoryRequest): Promise<Inventory> => {
        try {
            setLoading(true);
            const response = await createInventory(request);
            showToast("Inventário criado com sucesso!", "success");
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