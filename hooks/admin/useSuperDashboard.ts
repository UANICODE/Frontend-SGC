import { useEffect, useState } from "react";
import { getSuperDashboard } from "@/service/admin/superDashboard";
import { SuperDashboardResponse } from "@/types/admin/superDashboard.types";

export function useSuperDashboard() {
  const [data, setData] = useState<SuperDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSuperDashboard()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
}