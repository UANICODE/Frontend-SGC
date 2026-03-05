"use client";

import { useState } from "react";

import { Sale } from "@/types/attendant/sale/Sale";
import { Receipt } from "@/types/attendant/sale/Receipt";
import { addItem, archiveSale, createSale, finalizeSale, getSaleDetails, removeItem, updateQuantity } from "@/service/attendant/sale";

export function useSale(establishmentId: string) {
  const [sale, setSale] = useState<Sale | null>(null);
  const [loading, setLoading] = useState(false);

  async function startSale(cashRegisterId: string) {
    setLoading(true);
    const created = await createSale({
      establishmentId,
      cashRegisterId,
    });
    setSale(created);
    setLoading(false);
  }

  async function refresh() {
    if (!sale) return;
    setLoading(true);
    const updated = await getSaleDetails(
      sale.saleId,
      establishmentId
    );
    setSale(updated);
    setLoading(false);
  }

  async function handleAdd(productId: string) {
    if (!sale) return;
    setLoading(true);
    const updated = await addItem(sale.saleId, productId);
    setSale(updated);
    setLoading(false);
  }

  async function handleRemove(itemId: string) {
    if (!sale) return;
    setLoading(true);
    const updated = await removeItem(sale.saleId, itemId);
    setSale(updated);
    setLoading(false);
  }

  async function handleQuantity(itemId: string, quantity: number) {
    if (!sale) return;
    setLoading(true);
    const updated = await updateQuantity(
      sale.saleId,
      itemId,
      quantity
    );
    setSale(updated);
    setLoading(false);
  }

  async function handleArchive() {
    if (!sale) return;
    setLoading(true);
    await archiveSale(sale.saleId);
    setSale(null);
    setLoading(false);
  }

  async function handleFinalize(
    paymentMethodId: string
  ): Promise<Receipt> {
    if (!sale || sale.items.length === 0)
      throw new Error("Venda vazia não pode ser finalizada.");

    setLoading(true);
    const receipt = await finalizeSale({
      saleId: sale.saleId,
      paymentMethodId
  
    });
    setSale(null);
    setLoading(false);
    return receipt;
  }

  return {
    sale,
    loading,
    startSale,
    handleAdd,
    handleRemove,
    handleQuantity,
    handleArchive,
    handleFinalize,
  };
}