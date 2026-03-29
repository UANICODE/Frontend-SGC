import api from "@/service/api";

export async function getSuperDashboard() {
  const res = await api.get("/api/admin/super/dashboard");
  return res.data;
}