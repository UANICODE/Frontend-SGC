// service/admin/asset/listAssets.ts
import api from "@/service/api";
import { Asset } from "@/types/admin/asset";

export async function listAssets(establishmentId: string, categoryId?: string, page: number = 0, size: number = 10): Promise<{
    content: Asset[];
    totalElements: number;
    totalPages: number;
}> {
    const url = `/api/admin/assets?establishmentId=${establishmentId}&page=${page}&size=${size}${categoryId ? `&categoryId=${categoryId}` : ''}`;
    const { data } = await api.get(url);
    return data;
}