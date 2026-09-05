// service/admin/asset/deleteAssetCategory.ts
import api from "@/service/api";

export async function deleteAssetCategory(categoryId: string, establishmentId: string): Promise<void> {
    await api.delete(`/api/admin/asset-categories/${categoryId}?establishmentId=${establishmentId}`);
}