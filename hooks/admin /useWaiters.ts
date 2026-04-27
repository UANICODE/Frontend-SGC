// hooks/admin/useWaiters.ts
import { useEffect, useState, useCallback } from "react";
import { listWaiters, createWaiter, updateWaiter, deleteWaiter } from "@/service/admin/waiter";
import { Waiter, WaiterRequest } from "@/types/tables/tables";
import { useToast } from "@/ context/ToastContext";


export function useWaiters(establishmentId: string) {
  const [waiters, setWaiters] = useState<Waiter[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchWaiters = useCallback(async () => {
    try {
      setLoading(true);
      const data = await listWaiters(establishmentId);
      setWaiters(data);
    } catch (error: any) {
      showToast(error.message || "Erro ao carregar garçons", "error");
    } finally {
      setLoading(false);
    }
  }, [establishmentId, showToast]);

  const addWaiter = async (payload: WaiterRequest) => {
    try {
      const newWaiter = await createWaiter(payload);
      setWaiters(prev => [...prev, newWaiter]);
      showToast("Garçom criado com sucesso!", "success");
      return newWaiter;
    } catch (error: any) {
      showToast(error.message || "Erro ao criar garçom", "error");
      throw error;
    }
  };

  const editWaiter = async (id: string, payload: WaiterRequest) => {
    try {
      const updated = await updateWaiter(id, payload);
      setWaiters(prev => prev.map(w => w.id === id ? updated : w));
      showToast("Garçom atualizado com sucesso!", "success");
      return updated;
    } catch (error: any) {
      showToast(error.message || "Erro ao atualizar garçom", "error");
      throw error;
    }
  };

  const removeWaiter = async (id: string) => {
    try {
      await deleteWaiter(id, establishmentId);
      setWaiters(prev => prev.filter(w => w.id !== id));
      showToast("Garçom removido com sucesso!", "success");
    } catch (error: any) {
      showToast(error.message || "Erro ao remover garçom", "error");
      throw error;
    }
  };

  useEffect(() => {
    fetchWaiters();
  }, [fetchWaiters]);

  return { waiters, loading, fetchWaiters, addWaiter, editWaiter, removeWaiter };
}