"use client";

import { useEffect, useState, useCallback } from "react";
import { listCategories } from "@/service/admin/categories";
import { ListCategoriesRequest, CategoryItemResponse } from "@/types/admin/categories";
import { useToast } from "@/ context/ToastContext";


export function useCategories(establishmentId: string) {
  const { showToast } = useToast();

  const [data, setData] = useState<CategoryItemResponse[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<ListCategoriesRequest>({ establishmentId });

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      // Passa o objeto correto, com establishmentId fixo e filtros opcionais
      const response = await listCategories({ ...filters, establishmentId });
      setData(response || []);
    } catch (error) {
      setData([]);
      if (error instanceof Error) showToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  }, [filters, establishmentId, showToast]);

  // Dispara quando filters mudarem ou establishmentId mudar
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    data,
    loading,
    filters,
    setFilters,
    refresh: fetchCategories,
  };
}