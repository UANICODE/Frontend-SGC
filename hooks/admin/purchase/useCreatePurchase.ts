// hooks/admin/purchase/useCreatePurchase.ts
"use client";

import { useState } from "react";
import { useToast } from "@/ context/ToastContext";
import { CreatePurchaseRequest, PurchaseResponse } from "@/types/admin/purchase";
import { createPurchase } from "@/service/admin/purchases";

export function useCreatePurchase() {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<PurchaseResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    async function execute(request: CreatePurchaseRequest) {
        try {
            setLoading(true);
            setError(null);
            const response = await createPurchase(request);
            setData(response);
            showToast("Compra registrada com sucesso!", "success");
            return response;
        } catch (err) {
            const message = err instanceof Error ? err.message : "Erro ao registrar compra";
            setError(message);
            showToast(message, "error");
            throw err;
        } finally {
            setLoading(false);
        }
    }

    function reset() {
        setData(null);
        setError(null);
    }

    return { execute, loading, data, error, reset };
}