"use client";

import { useCallback, useState } from "react";
import { listRoles } from "@/service/superadmin/users/listRoles";
import { ListRolesResponse } from "@/types/superadmin/users/listRoles";

export function useListRoles() {
  const [data, setData] = useState<ListRolesResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const execute = useCallback(async (page = 0, size = 100) => {
    try {
      setLoading(true);

      const result = await listRoles(page, size);
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