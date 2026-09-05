// hooks/admin/inventory/useApproveInventory.ts
"use client";

import { useState } from "react";
import { approveInventory } from "@/service/admin/inventory/approveInventory";
import { ApproveInventoryResponse } from "@/types/admin/inventory";
import { useToast } from "@/ context/ToastContext";

export function useApproveInventory() {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);

    const execute = async (inventoryId: string): Promise<ApproveInventoryResponse> => {
        try {
            setLoading(true);
            const response = await approveInventory(inventoryId);
            showToast("Inventário aprovado com sucesso!", "success");
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