// hooks/admin/cost/useExportData.ts
"use client";

import { useState } from "react";
import { getExportData } from "@/service/admin/cost/getExportData";
import { ExportRequest, ExportDataResponse } from "@/types/admin/cost";
import { useToast } from "@/ context/ToastContext";

export function useExportData() {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<ExportDataResponse | null>(null);

    const fetch = async (request: ExportRequest): Promise<ExportDataResponse> => {
        try {
            setLoading(true);
            const response = await getExportData(request);
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
    };

    return { fetch, loading, data };
}