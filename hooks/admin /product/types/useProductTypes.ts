import { useToast } from "@/ context/ToastContext";
import { listProductTypes } from "@/service/admin/products";
import { ProductTypeResponse } from "@/types/admin/product-types";
import { useEffect, useState } from "react";


export function useProductTypes(establishmentId: string) {
  const { showToast } = useToast();

  const [data, setData] = useState<ProductTypeResponse[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchTypes() {
    try {
      setLoading(true);

      const response = await listProductTypes(establishmentId);
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
    fetchTypes();
  }, [establishmentId]);

  return {
    data,
    loading,
    refresh: fetchTypes,
  };
}