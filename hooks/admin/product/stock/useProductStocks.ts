"use client";

import { useEffect, useState } from "react";
import { listProductStocks } from "@/service/admin/productStock";
import { ListProductStocksRequest, ListProductStocksResponse } from "@/types/admin/product-stock";
import { useToast } from "@/ context/ToastContext";

export function useProductStocks(establishmentId: string) {
  const { showToast } = useToast();

  const [data, setData] = useState<ListProductStocksResponse | null>(null);
  const [loading, setLoading] = useState(false);

  async function fetchStocks() {
    try {
      setLoading(true);
      const response = await listProductStocks({ establishmentId });
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
    fetchStocks();
  }, []);

  return {
    data,
    loading,
    refresh: fetchStocks,
  };
}