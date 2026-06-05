"use client";

import { useEffect, useState } from "react";
import { ListEstablishmentsResponse } from "@/types/superadmin/establishment";
import { establishmentService } from "@/service/superadmin/establishment";

export function useListEstablishments() {
  const [data, setData] = useState<ListEstablishmentsResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const result = await establishmentService.list();
        setData(result);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return { data, loading };
}