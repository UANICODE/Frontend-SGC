// service/admin/table.ts
import api from "@/service/api";
import { Table, TableRequest } from "@/types/tables/tables";
import { handleHttpError } from "@/utils/httpErrorHandler";


export async function createTable(payload: TableRequest): Promise<Table> {
  try {
    const { data } = await api.post("/api/admin/tables", payload);
    return data;
  } catch (e) {
    handleHttpError(e);
  }
}

export async function updateTable(id: string, payload: TableRequest): Promise<Table> {
  try {
    const { data } = await api.put(`/api/admin/tables/${id}`, payload);
    return data;
  } catch (e) {
    handleHttpError(e);
  }
}

export async function listTables(establishmentId: string, onlyActive?: boolean): Promise<Table[]> {
  try {
    const { data } = await api.get(`/api/admin/tables`, {
      params: { establishmentId, onlyActive: onlyActive || false }
    });
    return data;
  } catch (e) {
    handleHttpError(e);
  }
}

export async function deleteTable(id: string, establishmentId: string): Promise<void> {
  try {
    await api.delete(`/api/admin/tables/${id}`, {
      params: { establishmentId }
    });
  } catch (e) {
    handleHttpError(e);
  }
}