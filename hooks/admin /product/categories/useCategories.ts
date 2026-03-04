import { useEffect, useState } from "react";
import {
  ListCategoriesRequest,
  ListCategoriesResponse,
} from "@/types/admin/categories";
import { listCategories } from "@/service/admin/categories";
import { useToast } from "@/ context/ToastContext";


export function useCategories(establishmentId: string) {
  const { showToast } = useToast();

  const [data, setData] =
    useState<ListCategoriesResponse | null>(null);

  const [loading, setLoading] = useState(false);

  const [filters, setFilters] =
    useState<ListCategoriesRequest>({
      establishmentId,
      page: 0,
      size: 10,
    });

  async function fetchCategories() {
    try {
      setLoading(true);
      const response = await listCategories(filters);
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
    fetchCategories();
  }, [filters]);

  return {
    data,
    loading,
    filters,
    setFilters,
    refresh: fetchCategories,
  };
}