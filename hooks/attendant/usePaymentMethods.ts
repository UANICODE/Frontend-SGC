"use client";

import { useEffect, useState } from "react";
import { PaymentMethod } from "@/types/attendant/sale/PaymentMethod";
import { listPaymentMethods } from "@/service/attendant/paymentMethod";

export function usePaymentMethods() {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await listPaymentMethods();
      setMethods(data);
      setLoading(false);
    }
    load();
  }, []);

  return { methods, loading };
}