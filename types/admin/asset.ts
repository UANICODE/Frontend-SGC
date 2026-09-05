// types/admin/asset.ts

export interface AssetCategory {
    id: string;
    name: string;
    description: string;
    active: boolean;
}

export interface Asset {
    id: string;
    code: string;
    name: string;
    categoryName: string;
    quantity: number;
    purchaseValue: number;
    acquisitionDate: string;
    location: string;
    status: string;
    notes: string;
}

export interface CreateAssetRequest {
    establishmentId: string;
    categoryId: string;
    name: string;
    quantity: number;
    purchaseValue: number;
    acquisitionDate: string;
    location: string;
    status?: string;
    notes?: string;
}

export interface RegisterMaintenanceRequest {
    assetId: string;
    maintenanceDate: string;
    cost?: number;
    description: string;
}

export interface DisposeAssetRequest {
    assetId: string;
    disposalType: 'VENDA' | 'DESCARTE' | 'PERDA';
    disposalDate: string;
    saleValue?: number;
    reason?: string;
}

export interface AssetDashboard {
    totalAssets: number;
    totalCategories: number;
    totalValue: number;
    newAssets: number;
    goodAssets: number;
    usedAssets: number;
    damagedAssets: number;
    unusableAssets: number;
    disposedAssets: number;
    topAssetsByValue: { code: string; name: string; category: string; quantity: number; value: number }[];
    totalMaintenanceCost: number;
    totalMaintenances: number;
}