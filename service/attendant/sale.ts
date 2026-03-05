
import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import { Sale } from "@/types/attendant/sale/Sale";
import { Receipt } from "@/types/attendant/sale/Receipt";

export async function createSale(payload: {
  establishmentId: string;
  cashRegisterId: string;
}): Promise<Sale> {
  try {
    const res = await api.post("/api/attendant/sales", payload);
    return res.data;
  } catch (e) {
    handleHttpError(e);
  }
}

export async function getSaleDetails(
  saleId: string,
  establishmentId: string
): Promise<Sale> {
  try {
    const res = await api.get(
      `/api/attendant/sales/${saleId}/${establishmentId}`
    );
    return res.data;
  } catch (e) {
    handleHttpError(e);
  }
}

export async function addItem(
  saleId: string,
  productId: string
): Promise<Sale> {
  try {
    const res = await api.post(
      `/api/attendant/sales/${saleId}/items`,
      { productId }
    );
    return res.data;
  } catch (e) {
    handleHttpError(e);
  }
}

export async function removeItem(
  saleId: string,
  itemId: string
): Promise<Sale> {
  try {
    const res = await api.delete(
      `/api/attendant/sales/${saleId}/items/${itemId}`
    );
    return res.data;
  } catch (e) {
    handleHttpError(e);
  }
}

export async function updateQuantity(
  saleId: string,
  itemId: string,
  quantity: number
): Promise<Sale> {
  try {
    const res = await api.put(
      `/api/attendant/sales/${saleId}/items/${itemId}`,
      { quantity }
    );
    return res.data;
  } catch (e) {
    handleHttpError(e);
  }
}

export async function archiveSale(saleId: string) {
  try {
    await api.put(`/api/attendant/sales/${saleId}/archive`);
  } catch (e) {
    handleHttpError(e);
  }
}

export async function finalizeSale(payload: {
  saleId: string;
  paymentMethodId: string
}): Promise<Receipt> {
  try {
    const res = await api.post(
      "/api/attendant/sales/finalize",
      payload
    );
    return res.data;
  } catch (e) {
    handleHttpError(e);
  }
}