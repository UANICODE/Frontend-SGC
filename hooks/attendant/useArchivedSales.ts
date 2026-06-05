// hooks/attendant/useArchivedSales.ts
import { useState, useEffect, useCallback } from "react";
import { ArchivedSale, listArchivedSales } from "@/service/attendant/listArchivedSales";
import { restoreSale } from "@/service/attendant/restoreSale";
import { useToast } from "@/ context/ToastContext";


export function useArchivedSales(establishmentId: string, cashRegisterId: string) {
  const [data, setData] = useState<ArchivedSale[]>([]);
  const [loading, setLoading] = useState(true);
  const [restoringId, setRestoringId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await listArchivedSales(establishmentId, cashRegisterId);
      setData(result || []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [establishmentId, cashRegisterId]);

  const restore = async (saleId: string) => {
    try {
      setRestoringId(saleId);
      await restoreSale(saleId);
      await fetch();
      toast.showToast("Venda restaurada com sucesso!", "success");
    } catch (e: any) {
      toast.showToast(e.message || "Erro ao restaurar venda", "error");
      throw e;
    } finally {
      setRestoringId(null);
    }
  };

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, restoringId, restore, refresh: fetch };
}