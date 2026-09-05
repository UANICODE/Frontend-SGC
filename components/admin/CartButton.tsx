// components/admin/CartButton.tsx
"use client";

import { ShoppingCart } from "lucide-react";

interface Props {
    itemCount: number;
    onClick: () => void;
}

export function CartButton({ itemCount, onClick }: Props) {
    return (
        <button
            onClick={onClick}
            className="relative bg-gradient-to-r from-primary to-secondary text-white px-4 py-2.5 rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
        >
            <ShoppingCart className="w-5 h-5" />
            <span className="font-medium">Carrinho</span>
            {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
                    {itemCount}
                </span>
            )}
        </button>
    );
}