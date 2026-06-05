// hooks/admin/useTables.ts
import { useEffect, useState, useCallback } from "react";
import { listTables, createTable, updateTable, deleteTable } from "@/service/admin/table";
import { useToast } from "@/ context/ToastContext";
import { Table, TableRequest } from "@/types/tables/tables";

export function useTables(establishmentId: string) {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchTables = useCallback(async () => {
    try {
      setLoading(true);
      const data = await listTables(establishmentId);
      setTables(data);
    } catch (error: any) {
      showToast(error.message || "Erro ao carregar mesas", "error");
    } finally {
      setLoading(false);
    }
  }, [establishmentId, showToast]);

  const addTable = async (payload: TableRequest) => {
    try {
      const newTable = await createTable(payload);
      setTables(prev => [...prev, newTable]);
      showToast("Mesa criada com sucesso!", "success");
      return newTable;
    } catch (error: any) {
      showToast(error.message || "Erro ao criar mesa", "error");
      throw error;
    }
  };

  const editTable = async (id: string, payload: TableRequest) => {
    try {
      const updated = await updateTable(id, payload);
      setTables(prev => prev.map(t => t.id === id ? updated : t));
      showToast("Mesa atualizada com sucesso!", "success");
      return updated;
    } catch (error: any) {
      showToast(error.message || "Erro ao atualizar mesa", "error");
      throw error;
    }
  };

  const removeTable = async (id: string) => {
    try {
      await deleteTable(id, establishmentId);
      setTables(prev => prev.filter(t => t.id !== id));
      showToast("Mesa removida com sucesso!", "success");
    } catch (error: any) {
      showToast(error.message || "Erro ao remover mesa", "error");
      throw error;
    }
  };

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  return { tables, loading, fetchTables, addTable, editTable, removeTable };
}