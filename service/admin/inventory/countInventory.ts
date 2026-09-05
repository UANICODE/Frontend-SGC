// service/admin/inventory/countInventory.ts
import api from "@/service/api";
import { CountInventoryRequest, Inventory } from "@/types/admin/inventory";
import { handleHttpError } from "@/utils/httpErrorHandler";

export async function countInventory(payload: CountInventoryRequest): Promise<Inventory> {
  
    try {
          const { data } = await api.put<Inventory>("/api/admin/inventories/count", payload);
    return data;
} catch(error) {
    handleHttpError(error);
}
}