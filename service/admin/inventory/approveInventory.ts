// service/admin/inventory/approveInventory.ts
import api from "@/service/api";
import { ApproveInventoryResponse } from "@/types/admin/inventory";
import { handleHttpError } from "@/utils/httpErrorHandler";

export async function approveInventory(inventoryId: string): Promise<ApproveInventoryResponse> {

    try {
            const { data } = await api.put<ApproveInventoryResponse>(`/api/admin/inventories/${inventoryId}/approve`);
    return data;
    } catch(error) {
        handleHttpError(error);
    }
}