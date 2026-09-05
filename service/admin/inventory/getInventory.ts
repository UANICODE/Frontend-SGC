// service/admin/inventory/getInventory.ts
import api from "@/service/api";
import { Inventory } from "@/types/admin/inventory";
import { handleHttpError } from "@/utils/httpErrorHandler";

export async function getInventory(inventoryId: string): Promise<Inventory> {
 
    try {
        const { data } = await api.get<Inventory>(`/api/admin/inventories/${inventoryId}`);
        return data;
    } catch(error) {
        handleHttpError(error);
    }
}