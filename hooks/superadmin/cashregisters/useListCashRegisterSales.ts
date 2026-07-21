"use client";

import { listCashRegisterSales } from "@/service/superadmin/cashregisters/listCashRegisterSales";
import { ListCashRegisterSalesRequest, ListCashRegisterSalesResponse } from "@/types/superadmin/cashregisters/listCashRegisterSales";
import {
  useCallback,
  useState,
} from "react";

export function useListCashRegisterSales() {
  const [data, setData] =
    useState<ListCashRegisterSalesResponse | null>(
      null
    );

  const [loading, setLoading] = useState(false);

  const execute = useCallback(
    async (
      cashRegisterId: string,
      payload: ListCashRegisterSalesRequest
    ) => {
      try {
        setLoading(true);

        const result =
          await listCashRegisterSales(
            cashRegisterId,
            payload
          );

        setData(result);

        return result;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const clear = useCallback(() => {
    setData(null);
  }, []);

  return {
    data,
    loading,
    execute,
    clear,
  };
}