// hooks/attendant/useCashRegisterSales.ts
"use client";

import { useState } from "react";
import { listCashRegisterSales } from "@/service/attendant/listCashRegisterSales";
import { CashRegisterSale } from "@/types/attendant/CashRegister";

export function useCashRegisterSales() {
  const [data, setData] = useState<CashRegisterSale[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetch(establishmentId: string, cashRegisterId: string) {
    try {
      setLoading(true);
      setError(null);

      const res = await listCashRegisterSales({
        establishmentId,
        cashRegisterId,
      });

      setData(res);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erro ao carregar vendas");
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, fetch };
}