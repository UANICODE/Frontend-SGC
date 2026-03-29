import api from "@/service/api";

export async function searchSuperProduct(name: string) {
  const res = await api.post("/api/admin/super/products/search", { name });
  return res.data;
}