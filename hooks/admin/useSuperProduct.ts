import { useEffect, useState } from "react";
import { searchSuperProduct } from "@/service/admin/superProduct";

export function useSuperProduct(name: string) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!name) return;

    const delay = setTimeout(() => {
      setLoading(true);
      searchSuperProduct(name)
        .then(setData)
        .catch(console.error)
        .finally(() => setLoading(false));
    }, 400);

    return () => clearTimeout(delay);
  }, [name]);

  return { data, loading };
}