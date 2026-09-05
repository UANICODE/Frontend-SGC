// hooks/admin/inventory/useInventories.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { listInventories } from "@/service/admin/inventory/listInventories";
import { Inventory } from "@/types/admin/inventory";
import { useToast } from "@/ context/ToastContext";

export function useInventories(establishmentId: string) {
    const { showToast } = useToast();
    const [data, setData] = useState<Inventory[]>([]);
    const [loading, setLoading] = useState(false);
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(0);
    const [size] = useState(10);

    const fetch = useCallback(async () => {
        if (!establishmentId) return;
        try {
            setLoading(true);
            const response = await listInventories(establishmentId, page, size);
            setData(response.content);
            setTotalElements(response.totalElements);
            setTotalPages(response.totalPages);
        } catch (error) {
            if (error instanceof Error) {
                showToast(error.message, "error");
            }
        } finally {
            setLoading(false);
        }
    }, [establishmentId, page, size, showToast]);

    useEffect(() => {
        fetch();
    }, [fetch]);

    const goToPage = (newPage: number) => setPage(newPage);

    return { data, loading, totalElements, totalPages, page, goToPage, refresh: fetch };
}