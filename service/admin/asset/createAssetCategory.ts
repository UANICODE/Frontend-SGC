// service/admin/asset/createAssetCategory.ts
import api from "@/service/api";
import { AssetCategory } from "@/types/admin/asset";

export async function createAssetCategory(payload: { establishmentId: string; name: string; description?: string }): Promise<AssetCategory> {
    const { data } = await api.post<AssetCategory>("/api/admin/asset-categories/create", payload);
    return data;
}