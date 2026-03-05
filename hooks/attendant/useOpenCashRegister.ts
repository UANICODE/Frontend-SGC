"use client";

import { openCashRegister } from "@/service/attendant/openCashRegister";
import { useState } from "react";

export function useOpenCashRegister() {
  const [loading, setLoading] = useState(false);

  async function execute(establishmentId: string) {
    try {
      setLoading(true);

      const result = await openCashRegister({
        establishmentId,
      });

      return result;
    } finally {
      setLoading(false);
    }
  }

  return {
    execute,
    loading,
  };
}