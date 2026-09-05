// hooks/admin/useAllSuppliers.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { listAllSuppliers } from "@/service/admin/purchases";
import { SupplierItemResponse } from "@/types/admin/supplier";
import { useToast } from "@/ context/ToastContext";

export function useAllSuppliers(establishmentId: string) {
    const { showToast } = useToast();
    const [data, setData] = useState<SupplierItemResponse[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchSuppliers = useCallback(async () => {
        if (!establishmentId) return;
        try {
            setLoading(true);
            const response = await listAllSuppliers(establishmentId);
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
        fetchSuppliers();
    }, [fetchSuppliers]);

    return { data, loading, refresh: fetchSuppliers };
}