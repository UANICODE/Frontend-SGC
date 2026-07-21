"use client";

import { useCallback, useState } from "react";
import { listUsers } from "@/service/superadmin/users/listUsers";
import {
  ListUsersRequest,
  ListUsersResponse,
} from "@/types/superadmin/users/listUsers";

export function useListUsers() {
  const [data, setData] = useState<ListUsersResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const execute = useCallback(async (payload: ListUsersRequest) => {
    try {
      setLoading(true);

      const result = await listUsers(payload);
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