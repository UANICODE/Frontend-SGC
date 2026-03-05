"use client";

import { useEffect, useState } from "react";
import { listIngredients } from "@/service/admin/ingredients";

import {
  ListIngredientsRequest,
  ListIngredientsResponse,
} from "@/types/admin/ingredients";
import { useToast } from "@/ context/ToastContext";

export function useIngredients(establishmentId: string) {

  const { showToast } = useToast();

  const [data, setData] =
    useState<ListIngredientsResponse | null>(null);

  const [loading, setLoading] = useState(false);

  const [filters, setFilters] =
    useState<ListIngredientsRequest>({
      establishmentId,
      name: "",
      statusId: undefined,
      page: 0,
      size: 10,
    });

  async function fetchIngredients() {
    try {

      setLoading(true);

      const response =
        await listIngredients(filters);

      setData(response);

    } catch (error) {

      if (error instanceof Error) {
        showToast(error.message, "error");
      }

    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchIngredients();
  }, [filters]);

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      establishmentId,
    }));
  }, [establishmentId]);

  return {
    data,
    loading,
    filters,
    setFilters,
    refresh: fetchIngredients,
  };
}