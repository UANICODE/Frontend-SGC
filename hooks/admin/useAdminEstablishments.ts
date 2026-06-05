"use client";

import { useEffect, useState } from "react";
import { listAdminEstablishments } from "@/service/admin/establishments";
import { ListAdminEstablishmentsResponse } from "@/types/admin/AdminEstablishment";
import { useToast } from "@/ context/ToastContext";


export function useAdminEstablishments() {
  const { showToast } = useToast();

  const [data, setData] =
    useState<ListAdminEstablishmentsResponse[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchEstablishments() {
    try {
      setLoading(true);
      const response = await listAdminEstablishments();
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
    fetchEstablishments();
  }, []);

  return { data, loading, refresh: fetchEstablishments };
}