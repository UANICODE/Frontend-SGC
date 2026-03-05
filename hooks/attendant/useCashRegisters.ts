"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CashRegister } from "@/types/attendant/CashRegister";
import { listCashRegisters } from "@/service/attendant/cashRegister";

interface Filters {
  establishmentId: string;
  today?: boolean;
  status?: "ABERTO" | "FECHADO" | null;
}

export function useCashRegisters(filters: Filters) {
  const [data, setData] = useState<CashRegister[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await listCashRegisters({
        establishmentId: filters.establishmentId,
        today: filters.today || null,
        status: filters.status || null,
      });

      const sorted = [...result].sort((a, b) => {
        if (a.status === "ABERTO") return -1;
        if (b.status === "ABERTO") return 1;
        return 0;
      });

      setData(sorted);
    } catch {
      setError("Erro ao carregar caixas.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openCash = useMemo(
    () => data.find((c) => c.status === "ABERTO"),
    [data]
  );

  return {
    data,
    loading,
    error,
    openCash,
    refresh: fetchData,
  };
}