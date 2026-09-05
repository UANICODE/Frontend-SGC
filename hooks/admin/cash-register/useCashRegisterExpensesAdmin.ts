// hooks/admin/cash-register/useCashRegisterExpensesAdmin.ts
"use client";

import { useState, useCallback, useRef } from "react";
import { listCashRegisterExpensesForAdmin } from "@/service/admin/listCashRegisterExpenses";
import { CashRegisterExpense } from "@/types/attendant/cashRegisterExpense";
import { useToast } from "@/ context/ToastContext";

export function useCashRegisterExpensesAdmin() {
    const { showToast } = useToast();
    const [data, setData] = useState<CashRegisterExpense[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fetchingRef = useRef<Record<string, boolean>>({}); // 🔥 Controlar fetch por ID

    const fetch = useCallback(async (cashRegisterId: string) => {
        // 🔥 Evitar requisições duplicadas para o mesmo ID
        if (!cashRegisterId) return;
        if (fetchingRef.current[cashRegisterId]) {
            console.log("⏳ Já está carregando, ignorando...");
            return;
        }

        fetchingRef.current[cashRegisterId] = true;
        
        try {
            setLoading(true);
            setError(null);
            console.log("🔍 Buscando despesas para caixa:", cashRegisterId);
            
            const response = await listCashRegisterExpensesForAdmin(cashRegisterId);
            console.log("📦 Resposta recebida:", response?.length || 0, "registros");
            
            setData(response || []);
            fetchingRef.current[cashRegisterId] = false;
        } catch (err: any) {
            console.error("❌ Erro ao buscar despesas:", err);
            setError(err.message || "Erro ao carregar despesas");
            showToast(err.message || "Erro ao carregar despesas", "error");
            fetchingRef.current[cashRegisterId] = false;
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    const reset = useCallback(() => {
        setData([]);
        setError(null);
        fetchingRef.current = {};
    }, []);

    return { data, loading, error, fetch, reset };
}