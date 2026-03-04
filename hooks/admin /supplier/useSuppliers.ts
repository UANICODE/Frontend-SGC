"use client";

import { useEffect, useState } from "react";
import { listSuppliers } from "@/service/admin/supplier";
import { ListSuppliersResponse } from "@/types/admin/supplier";

export function useSuppliers(establishmentId: string) {
  const [data, setData] = useState<ListSuppliersResponse>();
  const [loading, setLoading] = useState(true);

  async function fetch() {
    try {
      setLoading(true);

      const response = await listSuppliers({
        establishmentId,
        page: 0,
        size: 10,
      });

      setData(response);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetch();
  }, [establishmentId]);

  return {
    data,
    loading,
    refresh: fetch,
  };
}