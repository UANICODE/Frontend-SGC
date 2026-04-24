import { useState } from "react";
import { Sale } from "@/types/attendant/sale/Sale";
import { Receipt } from "@/types/attendant/sale/Receipt";
import { 
  addItem, 
  addItemByWeight, 
  archiveSale, 
  createSale, 
  finalizeSale, 
  generateReceipt, 
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

  async function handleAddByWeight(productId: string, weightInGrams: number, totalPrice: number) {
  if (!sale) return;
  
  setAddingProductIds((prev) => [...prev, productId]);
  try {
    await addItemByWeight(sale.saleId, productId, weightInGrams, totalPrice);
    await refreshSale(sale.saleId);
    toast.showToast("Item adicionado com sucesso!", "success");
  } catch (e: any) {
    toast.showToast(e.message || "Erro ao adicionar item", "error");
  } finally {
    setAddingProductIds((prev) => prev.filter((id) => id !== productId));
  }
}

async function handleGenerateReceipt(): Promise<Receipt> {
  if (!sale) throw new Error("Nenhuma venda ativa");
  
  setLoading(true);
  try {
    const receipt = await generateReceipt(sale.saleId, establishmentId);
    toast.showToast("Recibo gerado com sucesso!", "success");
    return receipt;
  } catch (e: any) {
    toast.showToast(e.message || "Erro ao gerar recibo", "error");
    throw e;
  } finally {
    setLoading(false);
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

async function handleFinalize(payments: { paymentMethodId: string; amount: number }[]): Promise<Receipt> {
  if (!sale || sale.items.length === 0)
    throw new Error("Venda vazia não pode ser finalizada.");

  setLoading(true);
  try {
    const receipt = await finalizeSale(establishmentId, {
      saleId: sale.saleId,
      payments: payments
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
     handleAddByWeight,
     handleGenerateReceipt,
  };
}