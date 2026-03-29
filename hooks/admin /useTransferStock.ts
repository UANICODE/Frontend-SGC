import { transferStock } from "@/service/admin/ transferStock";
import { useState } from "react";

export function useTransferStock() {
  const [loading, setLoading] = useState(false);

  async function execute(payload: any) {
    try {
      setLoading(true);
      const res = await transferStock(payload);

      return {
        success: true,
        message: res || "Transferência realizada com sucesso",
      };
    } catch (error: any) {
      return {
        success: false,
        message:
          error?.response?.data?.message ||
          error?.message ||
          "Erro ao transferir stock",
      };
    } finally {
      setLoading(false);
    }
  }

  return { execute, loading };
}