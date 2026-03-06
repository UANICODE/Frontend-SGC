import { useState } from "react";
import { Sale } from "@/types/attendant/sale/Sale";
import { Receipt } from "@/types/attendant/sale/Receipt";
import { 
  addItem, 
  archiveSale, 
  createSale, 
  finalizeSale, 
  getSaleDetails, 
  removeItem, 
  updateQuantity 
} from "@/service/attendant/sale";
import { useToast } from "@/ context/ToastContext";


export function useSale(establishmentId: string) {
  const [sale, setSale] = useState<Sale | null>(null);
  const [loading, setLoading] = useState(false);
  const [addingProductIds, setAddingProductIds] = useState<string[]>([]); // produtos da lista
  const [processingItemIds, setProcessingItemIds] = useState<string[]>([]); // itens da venda
  const toast = useToast();

  // Iniciar nova venda
  async function startSale(cashRegisterId: string) {
    setLoading(true);
    try {
      const created = await createSale({ establishmentId, cashRegisterId });
      setSale(created);
    } finally {
      setLoading(false);
    }
  }

  async function refreshSale(saleId: string) {
    setLoading(true);
    try {
      const updated = await getSaleDetails(saleId, establishmentId);
      setSale(updated);
    } finally {
      setLoading(false);
    }
  }

  // Adicionar produto
  async function handleAdd(productId: string) {
    if (!sale) return;
    if (addingProductIds.includes(productId)) return;

    setAddingProductIds((prev) => [...prev, productId]);
    try {
      await addItem(sale.saleId, productId, 1);
      await refreshSale(sale.saleId);
      toast.showToast("Item adicionado com sucesso!", "success");
    } catch (e: any) {
      toast.showToast(e.message || "Erro ao adicionar item", "error");
    } finally {
      setAddingProductIds((prev) => prev.filter((id) => id !== productId));
    }
  }

  // Remover item da venda
  async function handleRemove(itemId: string) {
    if (!sale) return;
    if (processingItemIds.includes(itemId)) return;

    setProcessingItemIds((prev) => [...prev, itemId]);
    try {
      const updatedSale = await removeItem(sale.saleId, itemId);
      setSale(updatedSale);
      toast.showToast("Item removido com sucesso!", "success");
    } catch (e: any) {
      toast.showToast(e.message || "Erro ao remover item", "error");
    } finally {
      setProcessingItemIds((prev) => prev.filter((id) => id !== itemId));
    }
  }

  // Alterar quantidade de item
  async function handleQuantity(itemId: string, quantity: number) {
    if (!sale) return;
    if (processingItemIds.includes(itemId)) return;

    setProcessingItemIds((prev) => [...prev, itemId]);
    try {
      await updateQuantity(sale.saleId, itemId, quantity);
      await refreshSale(sale.saleId);
      toast.showToast("Quantidade atualizada!", "success");
    } catch (e: any) {
      toast.showToast(e.message || "Erro ao atualizar quantidade", "error");
    } finally {
      setProcessingItemIds((prev) => prev.filter((id) => id !== itemId));
    }
  }

  async function handleArchive() {
    if (!sale) return;
    setLoading(true);
    try {
      await archiveSale(sale.saleId);
      setSale(null);
      toast.showToast("Venda arquivada!", "success");
    } catch (e: any) {
      toast.showToast(e.message || "Erro ao arquivar venda", "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleFinalize(paymentMethodId: string): Promise<Receipt> {
    if (!sale || sale.items.length === 0)
      throw new Error("Venda vazia não pode ser finalizada.");

    setLoading(true);
    try {
      const receipt = await finalizeSale(establishmentId, {
        saleId: sale.saleId,
        paymentMethodId,
      });
      setSale(null);
      toast.showToast("Venda finalizada!", "success");
      return receipt;
    } finally {
      setLoading(false);
    }
  }

  return {
    sale,
    loading,
    addingProductIds,
    processingItemIds,
    startSale,
    refreshSale,
    handleAdd,
    handleRemove,
    handleQuantity,
    handleArchive,
    handleFinalize,
  };
}