// hooks/admin/useProducts.ts
import { useEffect, useState, useMemo } from "react";
import { listProducts } from "@/service/admin/products";
import { ListProductsRequest, ListProductsResponse, ProductItemResponse } from "@/types/admin/product";
import { useToast } from "@/ context/ToastContext";

export function useProducts(establishmentId: string) {
  const { showToast } = useToast();

  const [data, setData] = useState<ListProductsResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState<ListProductsRequest>({
    establishmentId,
    page: 0,
    size: 1000, // carrega todos para filtrar localmente
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await listProducts(filters);
      setData(response ?? null);
    } catch (err) {
      console.error(err);
      showToast("Erro ao carregar produtos.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const setPage = (page: number) => {
    setFilters((prev) => ({ ...prev, page: page - 1 }));
  };

  // produtos filtrados localmente
  const filteredProducts: ProductItemResponse[] = useMemo(() => {
    if (!data) return [];

    return data.content.filter((p) => {
      if (filters.name && !p.name.toLowerCase().includes(filters.name.toLowerCase())) return false;
      if (filters.categoryId && p.categoryId !== filters.categoryId) return false;
      if (filters.productTypeId && p.productTypeId !== filters.productTypeId) return false;
      if (filters.active !== undefined && p.active !== filters.active) return false;
      return true;
    });
  }, [data, filters]);

  return {
    data,
    loading,
    filters,
    setFilters,
    setPage,
    refresh: fetchProducts,
    filteredProducts,
  };
}