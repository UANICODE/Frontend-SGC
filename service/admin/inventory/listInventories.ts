// service/admin/inventory/listInventories.ts
import api from "@/service/api";
import { Inventory } from "@/types/admin/inventory";
import { handleHttpError } from "@/utils/httpErrorHandler";
import { tr } from "framer-motion/client";

export async function listInventories(establishmentId: string, page: number = 0, size: number = 10): Promise<{
    content: Inventory[];
    totalElements: number;
    totalPages: number;
}> {
 

    try {
           const { data } = await api.get(`/api/admin/inventories?establishmentId=${establishmentId}&page=${page}&size=${size}`);
    return data;
} catch(error) {
    handleHttpError(error);
}
}