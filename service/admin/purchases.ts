// service/admin/purchases.ts
import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import {
    CreatePurchaseRequest,
    PurchaseResponse,
    ListPurchasesRequest,
    ListPurchasesResponse,
    ProductForPurchase,
} from "@/types/admin/purchase";
import { SupplierItemResponse } from "@/types/admin/supplier";

export async function createPurchase(
    payload: CreatePurchaseRequest
): Promise<PurchaseResponse> {
    try {
        const { data } = await api.post<PurchaseResponse>(
            "/api/admin/purchases/create",
            payload
        );
        return data;
    } catch (error) {
        handleHttpError(error);
        throw error;
    }
}

export async function listProductsForPurchase(
    establishmentId: string
): Promise<ProductForPurchase[]> {
    try {
        const { data } = await api.get<ProductForPurchase[]>(
            `/api/admin/purchases/products/for-purchase?establishmentId=${establishmentId}`
        );
        return data || [];
    } catch (error) {
        handleHttpError(error);
        return [];
    }
}

// 🔥 CORRIGIDO: O caminho correto é /api/admin/purchases/suppliers/all
export async function listAllSuppliers(
    establishmentId: string
): Promise<SupplierItemResponse[]> {
    try {
        const { data } = await api.get<SupplierItemResponse[]>(
            `/api/admin/purchases/suppliers/all?establishmentId=${establishmentId}`
        );
        return data || [];
    } catch (error) {
        handleHttpError(error);
        return [];
    }
}