// service/admin/asset/updateAssetCategory.ts
import api from "@/service/api";
import { AssetCategory } from "@/types/admin/asset";

export async function updateAssetCategory(categoryId: string, payload: { establishmentId: string; name: string; description?: string }): Promise<AssetCategory> {
    const { data } = await api.put<AssetCategory>(`/api/admin/asset-categories/${categoryId}`, payload);
    return data;
}