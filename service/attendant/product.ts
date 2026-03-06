import api from "@/service/api";
import { handleHttpError } from "@/utils/httpErrorHandler";
import { ProductItem } from "@/types/attendant/sale/Product";

export async function listProducts(payload: {
  establishmentId: string;
  categoryId?: string;
  name?: string;
}): Promise<ProductItem[]> {
  try {
    const res = await api.post(
      "/api/attendant/sales/products/filter",
      payload
    );
    console.log("produtos", res.data)
    return res.data;
  } catch (e) {
    handleHttpError(e);
  }
}