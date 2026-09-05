// service/admin/inventory/createInventory.ts
import api from "@/service/api";
import { CreateInventoryRequest, Inventory } from "@/types/admin/inventory";
import { handleHttpError } from "@/utils/httpErrorHandler";

export async function createInventory(payload: CreateInventoryRequest): Promise<Inventory> {

    try {
            const { data } = await api.post<Inventory>("/api/admin/inventories/create", payload);
    return data;
    } catch(error) {
        handleHttpError(error);
    }
}