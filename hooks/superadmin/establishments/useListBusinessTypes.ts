"use client";

import { useCallback, useState } from "react";
import { listBusinessTypes } from "@/service/superadmin/establishments/listBusinessTypes";
import { BusinessTypeItemResponse } from "@/types/superadmin/establishments/listBusinessTypes";

export function useListBusinessTypes() {
  const [data, setData] = useState<BusinessTypeItemResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const execute = useCallback(async (active = true) => {
    try {
      setLoading(true);

      const result = await listBusinessTypes(active);

      setData(result);

      return result;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data,
    loading,
    execute,
  };
}