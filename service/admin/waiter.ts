// service/admin/waiter.ts
import api from "@/service/api";
import { Waiter, WaiterRequest } from "@/types/tables/tables";
import { handleHttpError } from "@/utils/httpErrorHandler";


export async function createWaiter(payload: WaiterRequest): Promise<Waiter> {
  try {
    const { data } = await api.post("/api/admin/waiters", payload);
    return data;
  } catch (e) {
    handleHttpError(e);
  }
}

export async function updateWaiter(id: string, payload: WaiterRequest): Promise<Waiter> {
  try {
    const { data } = await api.put(`/api/admin/waiters/${id}`, payload);
    return data;
  } catch (e) {
    handleHttpError(e);
  }
}

export async function listWaiters(establishmentId: string, onlyActive?: boolean): Promise<Waiter[]> {
  try {
    const { data } = await api.get(`/api/admin/waiters`, {
      params: { establishmentId, onlyActive: onlyActive || false }
    });
    return data;
  } catch (e) {
    handleHttpError(e);
  }
}

export async function deleteWaiter(id: string, establishmentId: string): Promise<void> {
  try {
    await api.delete(`/api/admin/waiters/${id}`, {
      params: { establishmentId }
    });
  } catch (e) {
    handleHttpError(e);
  }
}