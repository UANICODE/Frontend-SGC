import api from "@/service/api";
import { PaymentMethod } from "@/types/attendant/sale/PaymentMethod";
import { handleHttpError } from "@/utils/httpErrorHandler";

export async function listPaymentMethods(): Promise<PaymentMethod[]> {
  try {
    const res = await api.get(
      "/api/attendant/payment-methods"
    );
    return res.data;
  } catch (e) {
    handleHttpError(e);
  }
}