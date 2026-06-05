
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
  productId: string,
  quantity: number = 1 // quantidade inicial = 1
): Promise<Sale> {
  try {
    const res = await api.post(
      `/api/attendant/sales/${saleId}/items`,
      { productId, quantity } // envia quantity junto
    );
    return res.data;
  } catch (e) {
    handleHttpError(e);
  }
}



// service/attendant/sale.ts - adicione esta função

export async function generateReceipt(
  saleId: string,
  establishmentId: string
): Promise<Receipt> {
  try {
    const res = await api.get(
      `/api/attendant/sales/${saleId}/receipt?establishmentId=${establishmentId}`
    );
    return res.data;
  } catch (e) {
    handleHttpError(e);
  }
}

export async function addItemByWeight(
  saleId: string,
  productId: string,
  weightInGrams: number,
  totalPrice: number
): Promise<Sale> {
  try {
    const res = await api.post(
      `/api/attendant/sales/${saleId}/items/by-weight`,
      { productId, weightInGrams }
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

// service/attendant/sale.ts - UNIFICADO

// service/attendant/sale.ts
export async function finalizeSale(
  establishmentId: string,
  payload: {
    saleId: string;
    payments: { paymentMethodId: string; amount: number }[];
  }
): Promise<Receipt> {
  try {
    const res = await api.post(
      `/api/attendant/sales/finalize?establishmentId=${establishmentId}`,
      payload
    );
    return res.data;
  } catch (e) {
    handleHttpError(e);
  }
}