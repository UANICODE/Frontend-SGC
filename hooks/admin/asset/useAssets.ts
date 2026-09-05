// hooks/admin/asset/useAssets.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { listAssets } from "@/service/admin/asset/listAssets";
import { Asset } from "@/types/admin/asset";
import { useToast } from "@/ context/ToastContext";

export function useAssets(establishmentId: string, categoryId?: string) {
    const { showToast } = useToast();
    const [data, setData] = useState<Asset[]>([]);
    const [loading, setLoading] = useState(false);
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(0);
    const [size] = useState(10);

    const fetch = useCallback(async () => {
        if (!establishmentId) return;
        try {
            setLoading(true);
            const response = await listAssets(establishmentId, categoryId, page, size);
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
    }, [establishmentId, categoryId, page, size, showToast]);

    useEffect(() => {
        fetch();
    }, [fetch]);

    const goToPage = (newPage: number) => setPage(newPage);

    return { data, loading, totalElements, totalPages, page, goToPage, refresh: fetch };
}