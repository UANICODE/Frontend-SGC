import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import {
  AddProductStockRequest,
  AddProductStockResponse,
  UpdateProductStockRequest,
  UpdateProductStockResponse,
  ListProductStocksRequest,
  ListProductStocksResponse,
} from "@/types/admin/product-stock";

/* ================= LIST ================= */

export async function listProductStocks(
  payload: ListProductStocksRequest
): Promise<ListProductStocksResponse> {
  try {
    const { data } = await api.post<ListProductStocksResponse>(
      "/api/admin/product-stocks/list",
      payload
    );
    return data;
  } catch (error) {
    handleHttpError(error);
  }
}

/* ================= ADD ================= */

export async function addProductStock(
  payload: AddProductStockRequest
): Promise<AddProductStockResponse> {
  try {
    const { data } = await api.post<AddProductStockResponse>(
      "/api/admin/product-stock/add",
      payload
    );
    return data;
  } catch (error) {
    handleHttpError(error);
  }
}

/* ================= UPDATE ================= */

export async function updateProductStock(
  payload: UpdateProductStockRequest
): Promise<UpdateProductStockResponse> {
  try {
    const { data } = await api.put<UpdateProductStockResponse>(
      "/api/admin/product-stock/update",
      payload
    );
    return data;
  } catch (error) {
    handleHttpError(error);
  }
}