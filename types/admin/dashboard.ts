// types/admin/dashboard.ts

import { AssetDashboard } from "./asset";
import { InventoryDashboard } from "./inventory";

export interface CombinedInventoryAssetDashboard {
    inventory: InventoryDashboard;
    assets: AssetDashboard;
}