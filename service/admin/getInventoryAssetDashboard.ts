// service/admin/dashboard/getInventoryAssetDashboard.ts
import api from "@/service/api";
import { CombinedInventoryAssetDashboard } from "@/types/admin/dashboard";
import { handleHttpError } from "@/utils/httpErrorHandler";

export async function getInventoryAssetDashboard(establishmentId: string): Promise<CombinedInventoryAssetDashboard> {
 
    try {
           const { data } = await api.get<CombinedInventoryAssetDashboard>(`/api/admin/dashboard/inventory-assets?establishmentId=${establishmentId}`);
   return data;
    } catch(error) {
        handleHttpError(error);
    }
    
}