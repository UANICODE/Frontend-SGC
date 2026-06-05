import { useEffect, useState } from "react";
import { getSalesByEstablishment } from "@/service/admin/superSales";

export function useSuperSales() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSalesByEstablishment()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
}