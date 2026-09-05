// service/admin/asset/createAsset.ts
import api from "@/service/api";
import { CreateAssetRequest, Asset } from "@/types/admin/asset";

export async function createAsset(payload: CreateAssetRequest): Promise<Asset> {
    const { data } = await api.post<Asset>("/api/admin/assets/create", payload);
    return data;
}