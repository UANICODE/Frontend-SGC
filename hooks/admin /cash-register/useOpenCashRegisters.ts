"use client";

import { useEffect, useState } from "react";
import { listOpenCashRegisters } from "@/service/admin/cash-register";
import { OpenCashRegisterResponse } from "@/types/admin/cash-register";


export function useOpenCashRegisters(establishmentId: string) {
  const [data, setData] = useState<OpenCashRegisterResponse[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetch() {
    try {
      setLoading(true);
      const response = await listOpenCashRegisters({
        establishmentId,
      });

      setData(response || []);
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