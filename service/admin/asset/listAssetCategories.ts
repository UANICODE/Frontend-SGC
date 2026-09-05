// service/admin/asset/listAssetCategories.ts
import api from "@/service/api";
import { AssetCategory } from "@/types/admin/asset";

export async function listAssetCategories(establishmentId: string, onlyActive?: boolean): Promise<AssetCategory[]> {
    const { data } = await api.get<AssetCategory[]>(`/api/admin/asset-categories?establishmentId=${establishmentId}&onlyActive=${onlyActive || false}`);
    return data;
}