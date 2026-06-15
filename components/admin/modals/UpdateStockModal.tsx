"use client";

import { useState } from "react";
import { updateProductStock } from "@/service/admin/productStock";
import { useToast } from "@/ context/ToastContext";
import { ProductStockItemResponse } from "@/types/admin/product-stock";
import { Package, Plus, X, TrendingUp, AlertCircle } from "lucide-react";

interface Props {
  establishmentId: string;
  item: ProductStockItemResponse;
  onClose: () => void;
  onSuccess: () => void;
}

export function UpdateStockModal({
  establishmentId,
  item,
  onClose,
  onSuccess,
}: Props) {
  const { showToast } = useToast();
  const [quantityToAdd, setQuantityToAdd] = useState("");
  const [loading, setLoading] = useState(false);
  const quantityNumber = Number(quantityToAdd || 0);

  async function handleSubmit() {
    if (!quantityToAdd || quantityNumber <= 0) {
      showToast("Informe uma quantidade válida para adicionar", "error");
      return;
    }

    try {
      setLoading(true);
      await updateProductStock({
        establishmentId,
        productId: item.productId,
        quantityToAdd: quantityNumber,
      });
      showToast("Stock atualizado com sucesso!", "success");
      onSuccess();
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        showToast(error.message, "error");
      }
    } finally {
      setLoading(false);
    }
  }

  const result = Number((item.quantity + quantityNumber).toFixed(2));

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-slideInUp">
        
        {/* Header */}
        <div className="">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-white">Entrada de Stock</h2>
            </div>
            <button 
              onClick={onClose}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 " />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
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
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-gray-600">Stock atual:</span>
            </div>
            <span className="font-bold text-2xl text-blue-700">{item.quantity}</span>
          </div>

          {/* Informação de ajuda */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-700">
              Informe a <strong>quantidade de entrada</strong>. O sistema irá somar automaticamente ao stock existente.
            </p>
          </div>

          {/* Input da quantidade */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Quantidade a adicionar *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-pointer-events-none">
                <span className="text-gray-400 text-sm">+</span>
              </div>
              <input
                type="number"
                step="0.001"
                placeholder="Ex: 0.500"
                value={quantityToAdd}
                onChange={(e) => setQuantityToAdd(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 pl-8 text-lg font-semibold outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                autoFocus
              />
            </div>
          </div>

          {/* Preview do resultado */}
          {quantityToAdd && quantityNumber > 0 && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Resultado final:</span>
                <div className="text-right">
                  <span className="text-xs text-gray-500 line-through mr-2">{item.quantity}</span>
                  <span className="text-2xl font-bold text-green-700">{result}</span>
                </div>
              </div>
              <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((result / (item.quantity + result)) * 100, 100)}%` }}
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
              disabled={loading || !quantityToAdd || quantityNumber <= 0}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2.5 rounded-xl font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processando...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Adicionar Stock
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}