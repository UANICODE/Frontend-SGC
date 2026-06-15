"use client";

import { useState } from "react";
import { removeProductStock } from "@/service/admin/productStock";
import { useToast } from "@/ context/ToastContext";
import { ProductStockItemResponse } from "@/types/admin/product-stock";
import { AlertTriangle, Trash2, X, Package, TrendingDown } from "lucide-react";

interface Props {
  establishmentId: string;
  item: ProductStockItemResponse;
  onClose: () => void;
  onSuccess: () => void;
}

export function RemoveStockModal({
  establishmentId,
  item,
  onClose,
  onSuccess,
}: Props) {
  const { showToast } = useToast();
  const [quantityToRemove, setQuantityToRemove] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const quantityNumber = Number(quantityToRemove || 0);
  const result = Number((item.quantity - quantityNumber).toFixed(3));
  const hasInsufficientStock = quantityNumber > item.quantity;

  async function handleSubmit() {
    if (!quantityToRemove || quantityNumber <= 0) {
      showToast("Informe uma quantidade válida para remover", "error");
      return;
    }

    if (hasInsufficientStock) {
      showToast(`Stock insuficiente. Disponível: ${item.quantity}`, "error");
      return;
    }

    try {
      setLoading(true);
      await removeProductStock({
        establishmentId,
        productId: item.productId,
        quantityToRemove: quantityNumber,
        reason: reason.trim() || "Remoção manual",
      });

      showToast("Stock removido com sucesso!", "success");
      onSuccess();
      onClose();
    } catch (error: any) {
      showToast(error.message || "Erro ao remover stock", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-slideInUp">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                <Trash2 className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">Remover Stock</h2>
            </div>
            <button 
              onClick={onClose}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Aviso */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">
              Esta ação irá <strong>diminuir</strong> o stock permanentemente.
            </p>
          </div>

          {/* Informação do produto */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Produto</p>
                <p className="font-semibold text-gray-800">{item.productName}</p>
              </div>
            </div>
          </div>

          {/* Stock atual */}
          <div className="flex justify-between items-center p-3 bg-blue-50 rounded-xl border border-blue-100">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-gray-600">Stock atual:</span>
            </div>
            <span className="font-bold text-2xl text-blue-700">{item.quantity}</span>
          </div>

          {/* Quantidade a remover */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Quantidade a remover *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-pointer-events-none">
                <span className="text-gray-400 text-sm">-</span>
              </div>
              <input
                type="number"
                step="0.001"
                placeholder="Ex: 0.500"
                value={quantityToRemove}
                onChange={(e) => setQuantityToRemove(e.target.value)}
                className={`w-full border-2 rounded-xl px-4 py-3 pl-8 text-lg font-semibold outline-none transition-all ${
                  hasInsufficientStock
                    ? "border-red-500 bg-red-50 focus:border-red-600 focus:ring-2 focus:ring-red-500/20"
                    : "border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                }`}
                autoFocus
              />
            </div>
            {hasInsufficientStock && (
              <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Stock insuficiente. Máximo: {item.quantity}
              </p>
            )}
          </div>

          {/* Motivo */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Motivo (opcional)
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all bg-white"
            >
              <option value="">Selecione o motivo</option>
              <option value="Devolução de cliente">📦 Devolução de cliente</option>
              <option value="Produto danificado">⚠️ Produto danificado</option>
              <option value="Produto vencido">📅 Produto vencido</option>
              <option value="Roubo/Perda">🔒 Roubo/Perda</option>
              <option value="Ajuste de inventário">📊 Ajuste de inventário</option>
              <option value="Consumo interno">🍽️ Consumo interno</option>
              <option value="Outro">❓ Outro</option>
            </select>
          </div>

          {/* Preview do resultado */}
          {quantityToRemove && quantityNumber > 0 && !hasInsufficientStock && (
            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-4 border border-red-200">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Resultado final:</span>
                <div className="text-right">
                  <span className="text-xs text-gray-500 line-through mr-2">{item.quantity}</span>
                  <span className="text-2xl font-bold text-red-600">{result}</span>
                </div>
              </div>
              <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full transition-all duration-500"
                  style={{ width: `${(result / item.quantity) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Ações */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-300"
            >
              Cancelar
            </button>

            <button
              onClick={handleSubmit}
              disabled={loading || !quantityToRemove || hasInsufficientStock}
              className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2.5 rounded-xl font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Removendo...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Remover Stock
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}