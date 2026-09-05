// components/admin/modals/CartModal.tsx
"use client";

import { useState, useMemo } from "react";
import {
    X,
    ShoppingCart,
    Trash2,
    Save,
    Store,
    Package,
    Plus,
    Minus,
    AlertCircle,
} from "lucide-react";

import { CartItem } from "@/types/admin/purchase";
import { useAllSuppliers } from "@/hooks/admin/useAllSuppliers";
import { useToast } from "@/ context/ToastContext";
import { useCreatePurchase } from "@/hooks/admin/purchase/useCreatePurchase";

interface Props {
    establishmentId: string;
    items: CartItem[];
    onClose: () => void;
    onSuccess: () => void;
     totalQuantity: number;  
    onRemoveItem: (productId: string) => void;
    onUpdateQuantity: (productId: string, quantity: number) => void;
    onUpdatePrice: (productId: string, price: number) => void;
    clearCart: () => void;
}

export function CartModal({
    establishmentId,
    items,
    onClose,
     totalQuantity,
    onSuccess,
    onRemoveItem,
    onUpdateQuantity,
    onUpdatePrice,
    clearCart,
}: Props) {
    const { showToast } = useToast();
    const { data: suppliers, loading: loadingSuppliers } = useAllSuppliers(establishmentId);
    const { execute, loading } = useCreatePurchase();

    const [supplierId, setSupplierId] = useState("");
    const [notes, setNotes] = useState("");
    
    // 🔥 Estado local para controlar o valor do input de quantidade
    const [inputValues, setInputValues] = useState<Record<string, string>>({});
    
    // 🔥 Estado local para controlar o valor do input de preço
    const [priceInputValues, setPriceInputValues] = useState<Record<string, string>>({});

    const totalAmount = useMemo(() => {
        return items.reduce((sum, i) => sum + (i.quantity * i.purchasePrice), 0);
    }, [items]);

    const handleSubmit = async () => {
        if (!supplierId) {
            showToast("Selecione um fornecedor", "error");
            return;
        }

        if (items.length === 0) {
            showToast("Carrinho vazio", "error");
            return;
        }

        try {
            await execute({
                establishmentId,
                supplierId,
                items: items.map((i) => ({
                    productId: i.productId,
                    quantity: i.quantity,
                    purchasePrice: i.purchasePrice,
                })),
                notes: notes || undefined,
            });

            clearCart();
            onSuccess();
            onClose();
        } catch (error) {
            // Erro já tratado pelo hook
        }
    };

    // 🔥 QUANTIDADE - Permite apagar todo o número
    const handleQuantityChange = (productId: string, value: string) => {
        setInputValues(prev => ({ ...prev, [productId]: value }));
        
        if (value === "") {
            return;
        }
        
        const numValue = parseFloat(value);
        if (!isNaN(numValue) && numValue >= 0) {
            onUpdateQuantity(productId, numValue);
        }
    };

    const handleQuantityBlur = (productId: string) => {
        const currentInputValue = inputValues[productId];
        
        if (!currentInputValue || currentInputValue === "") {
            setInputValues(prev => ({ ...prev, [productId]: "1" }));
            onUpdateQuantity(productId, 1);
            return;
        }
        
        const numValue = parseFloat(currentInputValue);
        if (isNaN(numValue) || numValue <= 0) {
            setInputValues(prev => ({ ...prev, [productId]: "1" }));
            onUpdateQuantity(productId, 1);
        } else {
            onUpdateQuantity(productId, numValue);
        }
    };

    // 🔥 PREÇO COMPRA - Permite apagar todo o número
    const handlePriceChange = (productId: string, value: string) => {
        setPriceInputValues(prev => ({ ...prev, [productId]: value }));
        
        if (value === "") {
            return;
        }
        
        const numValue = parseFloat(value);
        if (!isNaN(numValue) && numValue >= 0) {
            onUpdatePrice(productId, numValue);
        }
    };

    const handlePriceBlur = (productId: string) => {
        const currentInputValue = priceInputValues[productId];
        
        if (!currentInputValue || currentInputValue === "") {
            // Se estiver vazio, coloca 0
            setPriceInputValues(prev => ({ ...prev, [productId]: "0" }));
            onUpdatePrice(productId, 0);
            return;
        }
        
        const numValue = parseFloat(currentInputValue);
        if (isNaN(numValue) || numValue < 0) {
            setPriceInputValues(prev => ({ ...prev, [productId]: "0" }));
            onUpdatePrice(productId, 0);
        } else {
            onUpdatePrice(productId, numValue);
        }
    };

    // 🔥 Sincronizar inputValues com items quando o carrinho mudar
    useMemo(() => {
        const newInputValues: Record<string, string> = {};
        const newPriceValues: Record<string, string> = {};
        items.forEach(item => {
            newInputValues[item.productId] = String(item.quantity);
            newPriceValues[item.productId] = String(item.purchasePrice);
        });
        setInputValues(newInputValues);
        setPriceInputValues(newPriceValues);
    }, [items]);

    const formatCurrency = (value: number) => {
        return value.toFixed(2) + " MT";
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl max-h-[95vh] flex flex-col">
                {/* HEADER */}
                <div className="bg-gradient-to-r from-primary to-secondary px-6 py-5 flex-shrink-0 rounded-t-2xl">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                                <ShoppingCart className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">
                                    Carrinho de Compras
                                </h2>
                                <p className="text-white/80 text-sm">
                                    {items.length} produto(s)
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                        >
                            <X className="w-6 h-6 text-white" />
                        </button>
                    </div>
                </div>

                {/* BODY */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* FORNECEDOR */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                            <Store className="w-4 h-4 text-primary" />
                            Fornecedor *
                        </label>
                        <select
                            value={supplierId}
                            onChange={(e) => setSupplierId(e.target.value)}
                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white"
                            disabled={loadingSuppliers}
                        >
                            <option value="">Selecione um fornecedor</option>
                            {suppliers.map((s) => (
                                <option key={s.id} value={s.id}>
                                    {s.name} {s.nuit && `- NUIT: ${s.nuit}`}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* ITEMS */}
                    {items.length === 0 ? (
                        <div className="text-center py-12">
                            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 font-medium">Carrinho vazio</p>
                            <p className="text-sm text-gray-400">
                                Adicione produtos na gestão de stock
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {items.map((item) => (
                                <div
                                    key={item.productId}
                                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-primary/20 transition-all"
                                >
                                    {/* Imagem */}
                                    <div className="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                                        {item.productImage ? (
                                            <img
                                                src={item.productImage}
                                                alt={item.productName}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <Package className="w-8 h-8 text-gray-400" />
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-gray-800 truncate">
                                            {item.productName}
                                        </p>
                                        <p className="text-sm text-gray-400">
                                            Preço venda: {formatCurrency(item.price)}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            Stock atual: {item.stockQuantity}
                                        </p>
                                    </div>

                                    {/* 🔥 PREÇO COMPRA - CORRIGIDO */}
                                    <div className="w-32">
                                        <label className="text-xs text-gray-500 block mb-1">
                                            Preço Compra
                                        </label>
                                        <input
                                            type="text"
                                            inputMode="decimal"
                                            value={priceInputValues[item.productId] ?? String(item.purchasePrice)}
                                            onChange={(e) => handlePriceChange(item.productId, e.target.value)}
                                            onBlur={() => handlePriceBlur(item.productId)}
                                            className="w-full border-2 border-gray-200 rounded-lg px-2 py-1 text-right text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                            placeholder="0.00"
                                        />
                                    </div>

                                    {/* 🔥 QUANTIDADE - CORRIGIDA */}
                                    <div className="w-24">
                                        <label className="text-xs text-gray-500 block mb-1">
                                            Qtd
                                        </label>
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => {
                                                    const newQty = item.quantity - 1;
                                                    if (newQty <= 0) {
                                                        onRemoveItem(item.productId);
                                                    } else {
                                                        onUpdateQuantity(item.productId, newQty);
                                                        setInputValues(prev => ({ 
                                                            ...prev, 
                                                            [item.productId]: String(newQty) 
                                                        }));
                                                    }
                                                }}
                                                className="p-1 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
                                            >
                                                <Minus className="w-3 h-3" />
                                            </button>
                                            <input
                                                type="text"
                                                inputMode="decimal"
                                                value={inputValues[item.productId] ?? String(item.quantity)}
                                                onChange={(e) => handleQuantityChange(item.productId, e.target.value)}
                                                onBlur={() => handleQuantityBlur(item.productId)}
                                                className="w-14 border-2 border-gray-200 rounded-lg px-1 py-1 text-center text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                            />
                                            <button
                                                onClick={() => {
                                                    const newQty = item.quantity + 1;
                                                    onUpdateQuantity(item.productId, newQty);
                                                    setInputValues(prev => ({ 
                                                        ...prev, 
                                                        [item.productId]: String(newQty) 
                                                    }));
                                                }}
                                                className="p-1 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
                                            >
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Subtotal */}
                                    <div className="w-24 text-right">
                                        <p className="text-sm font-semibold text-primary">
                                            {formatCurrency(item.quantity * item.purchasePrice)}
                                        </p>
                                    </div>

                                    {/* Remove */}
                                    <button
                                        onClick={() => onRemoveItem(item.productId)}
                                        className="p-2 text-gray-400 hover:text-red-500 transition"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* TOTAL */}
                    {items.length > 0 && (
                        <div className="flex justify-between items-center p-4 bg-primary/5 rounded-xl border border-primary/20">
                            <span className="font-semibold text-gray-700">Total da Compra</span>
                            <span className="text-2xl font-bold text-primary">
                                {formatCurrency(totalAmount)}
                            </span>
                        </div>
                    )}

                    {/* OBSERVAÇÕES */}
                    {items.length > 0 && (
                        <div>
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-gray-400" />
                                Observações
                            </label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Informações adicionais sobre esta compra..."
                                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 mt-1 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                                rows={2}
                            />
                        </div>
                    )}
                </div>

                {/* FOOTER */}
                <div className="flex gap-3 p-6 bg-gray-50 border-t flex-shrink-0 rounded-b-2xl">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 px-4 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-100 transition-all"
                    >
                        Fechar
                    </button>

                    {items.length > 0 && (
                        <button
                            onClick={clearCart}
                            className="px-4 py-3 border-2 border-red-200 text-red-600 rounded-xl font-medium hover:bg-red-50 transition-all"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}

                    <button
                        onClick={handleSubmit}
                        disabled={loading || items.length === 0 || !supplierId}
                        className="flex-1 bg-gradient-to-r from-primary to-secondary text-white px-4 py-3 rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Registrando...
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                Registrar Compra
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}