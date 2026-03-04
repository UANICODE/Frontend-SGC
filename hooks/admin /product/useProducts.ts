import { useEffect, useState } from "react";
import {
  ListProductsRequest,
  ListProductsResponse,
} from "@/types/admin/product";
import { listProducts } from "@/service/admin/products";
import { useToast } from "@/ context/ToastContext";


export function useProducts(establishmentId: string) {
  const { showToast } = useToast();

  const [data, setData] = useState<ListProductsResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState<ListProductsRequest>({
    establishmentId,
    page: 0,
    size: 10,
  });

  async function fetchProducts() {
    try {
      setLoading(true);
      const response = await listProducts(filters);
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
    fetchProducts();
  }, [filters]);

  return {
    data,
    loading,
    filters,
    setFilters,
    refresh: fetchProducts,
  };
}