// hooks/attendant/useAssignSale.ts
import { useState } from "react";
import { assignSale, AssignSaleRequest } from "@/service/attendant/assignSale";
import { useToast } from "@/ context/ToastContext";


export function useAssignSale(establishmentId: string) {
  const [assigning, setAssigning] = useState<string | null>(null);
  const { showToast } = useToast();

  const assign = async (saleId: string, payload: AssignSaleRequest) => {
    setAssigning(saleId);
    try {
      await assignSale(saleId, establishmentId, payload);
      showToast("Mesa/Garçom atribuídos com sucesso!", "success");
    } catch (error: any) {
      showToast(error.message || "Erro ao atribuir", "error");
      throw error;
    } finally {
      setAssigning(null);
    }
  };

  return { assign, assigning };
}