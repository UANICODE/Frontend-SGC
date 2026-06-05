"use client";

import { useEffect, useState } from "react";
import { listUsers } from "@/service/admin/user";
import { ListUsersByEstablishmentResponse } from "@/types/admin/user";

export function useUsers(establishmentId: string) {
  const [data, setData] = useState<
    ListUsersByEstablishmentResponse[]
  >([]);
  const [loading, setLoading] = useState(true);

  async function fetch() {
    try {
      setLoading(true);
      const response = await listUsers({ establishmentId });
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