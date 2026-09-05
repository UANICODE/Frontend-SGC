// service/admin/inventory/listInventoryTypes.ts
import api from "@/service/api";
import { InventoryType } from "@/types/admin/inventory";
import { handleHttpError } from "@/utils/httpErrorHandler";

export async function listInventoryTypes(): Promise<InventoryType[]> {

    try {
            const { data } = await api.get<InventoryType[]>("/api/admin/inventory-types");
    return data;
    } catch(error) {
        handleHttpError(error);
    }
}