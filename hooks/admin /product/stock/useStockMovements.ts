import { useState } from "react";
import { listStockMovements } from "@/service/admin/listStockMovements";
import { StockMovement } from "@/types/admin/product";

export function useStockMovements() {
  const [data, setData] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetch(establishmentId: string) {
    try {
      setLoading(true);
      setError(null);
      const res = await listStockMovements({ establishmentId });
      setData(res);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, fetch };
}