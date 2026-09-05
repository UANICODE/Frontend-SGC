// service/admin/asset/registerMaintenance.ts
import api from "@/service/api";
import { RegisterMaintenanceRequest } from "@/types/admin/asset";

export async function registerMaintenance(payload: RegisterMaintenanceRequest): Promise<void> {
    await api.post("/api/admin/assets/maintenance/register", payload);
}