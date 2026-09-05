// service/admin/asset/updateAsset.ts
import api from "@/service/api";
import { CreateAssetRequest, Asset } from "@/types/admin/asset";

export async function updateAsset(assetId: string, payload: CreateAssetRequest): Promise<Asset> {
    const { data } = await api.put<Asset>(`/api/admin/assets/${assetId}`, payload);
    return data;
}