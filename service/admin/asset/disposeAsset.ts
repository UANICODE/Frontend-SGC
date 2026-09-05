// service/admin/asset/disposeAsset.ts
import api from "@/service/api";
import { DisposeAssetRequest } from "@/types/admin/asset";

export async function disposeAsset(payload: DisposeAssetRequest): Promise<void> {
    await api.post("/api/admin/assets/disposal/register", payload);
}