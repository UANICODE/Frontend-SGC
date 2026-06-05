import api from "@/service/api";

export async function getSalesByEstablishment() {
  const res = await api.get("/api/admin/super/sales");
  return res.data;
}