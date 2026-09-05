
"use client";

import { useState, useCallback, useEffect } from "react";
import { CartItem } from "@/types/admin/purchase";
import { useToast } from "@/ context/ToastContext";

const CART_STORAGE_KEY = "purchase_cart";

export function useCart() {
    const { showToast } = useToast();
    
    const [items, setItems] = useState<CartItem[]>(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem(CART_STORAGE_KEY);
            if (saved) {
                try {
                    return JSON.parse(saved);
                } catch {
                    return [];
                }
            }
        }
        return [];
    });

    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
        }
    }, [items]);

    const addItem = useCallback((product: CartItem) => {
        setItems((prev) => {
            const existing = prev.find((i) => i.productId === product.productId);
            if (existing) {
                showToast(`${product.productName} já está no carrinho`, "error");
                return prev;
            }
            showToast(`${product.productName} adicionado ao carrinho`, "success");
            return [...prev, product];
        });
    }, [showToast]);

    const removeItem = useCallback((productId: string) => {
        setItems((prev) => {
            const item = prev.find((i) => i.productId === productId);
            if (item) {
                showToast(`${item.productName} removido do carrinho`, "success");
            }
            return prev.filter((i) => i.productId !== productId);
        });
    }, [showToast]);

    const updateQuantity = useCallback((productId: string, quantity: number) => {
        if (quantity < 0) {
            return;
        }
        setItems((prev) =>
            prev.map((i) =>
                i.productId === productId ? { ...i, quantity } : i
            )
        );
    }, []);

    const updatePurchasePrice = useCallback((productId: string, purchasePrice: number) => {
        setItems((prev) =>
            prev.map((i) =>
                i.productId === productId ? { ...i, purchasePrice } : i
            )
        );
    }, []);

    const clearCart = useCallback(() => {
        setItems([]);
        if (typeof window !== "undefined") {
            localStorage.removeItem(CART_STORAGE_KEY);
        }
    }, []);

    // 🔥 CORRIGIDO: totalItems = número de produtos diferentes (itens no carrinho)
    const totalItems = items.length; // ← Isso conta quantos produtos diferentes estão no carrinho
    
    // 🔥 totalQuantity = soma total de todas as quantidades (para exibir no modal)
    const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0);
    const totalAmount = items.reduce((sum, i) => sum + (i.quantity * i.purchasePrice), 0);

    return {
        items,
        totalItems,      // ← Número de produtos diferentes (para o badge)
        totalQuantity,   // ← Soma de todas as quantidades (para o modal)
        totalAmount,
        addItem,
        removeItem,
        updateQuantity,
        updatePurchasePrice,
        clearCart,
        isEmpty: items.length === 0,
    };
}