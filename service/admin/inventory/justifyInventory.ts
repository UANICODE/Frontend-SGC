// service/admin/inventory/justifyInventory.ts
import api from "@/service/api";
import { JustifyInventoryRequest, Inventory } from "@/types/admin/inventory";
import { handleHttpError } from "@/utils/httpErrorHandler";

export async function justifyInventory(payload: JustifyInventoryRequest): Promise<Inventory> {

    try {
            const { data } = await api.put<Inventory>("/api/admin/inventories/justify", payload);
    return data;
} catch(error) {
    handleHttpError(error);
}
}