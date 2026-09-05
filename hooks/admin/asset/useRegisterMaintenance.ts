// hooks/admin/asset/useRegisterMaintenance.ts
"use client";

import { useState } from "react";
import { registerMaintenance } from "@/service/admin/asset/registerMaintenance";
import { RegisterMaintenanceRequest } from "@/types/admin/asset";
import { useToast } from "@/ context/ToastContext";

export function useRegisterMaintenance() {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);

    const execute = async (payload: RegisterMaintenanceRequest): Promise<void> => {
        try {
            setLoading(true);
            await registerMaintenance(payload);
            showToast("Manutenção registrada com sucesso!", "success");
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