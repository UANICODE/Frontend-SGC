"use client";

import { useState } from "react";
import {
  createIngredient,
  updateIngredient,
} from "@/service/admin/ingredients";
import { IngredientItemResponse } from "@/types/admin/ingredients";
import { useToast } from "@/ context/ToastContext";
import { Package, X, Plus, Save, AlertCircle, TrendingUp, Scale, Hash } from "lucide-react";

interface Props {
  establishmentId: string;
  ingredient: IngredientItemResponse | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function IngredientModal({
  establishmentId,
  ingredient,
  onClose,
  onSuccess,
}: Props) {
  const { showToast } = useToast();

  const [name, setName] = useState(ingredient?.name ?? "");
  const [unitName, setUnitName] = useState(ingredient?.unitName ?? "");
  const [unitSymbol, setUnitSymbol] = useState(ingredient?.unitSymbol ?? "");
  const [quantity, setQuantity] = useState<number | undefined>(ingredient?.quantity);
  const [minimumLimit, setMinimumLimit] = useState(ingredient?.minimumLimit ?? 0);
  const [loading, setLoading] = useState(false);

  const isEdit = !!ingredient;
  const isLowStock = quantity !== undefined && minimumLimit > 0 && quantity <= minimumLimit;

  async function handleSubmit() {
    if (!name.trim()) {
      showToast("Nome é obrigatório.", "error");
      return;
    }

    if (!unitName.trim()) {
      showToast("Nome da unidade é obrigatório.", "error");
      return;
    }

    if (!unitSymbol.trim()) {
      showToast("Símbolo da unidade é obrigatório.", "error");
      return;
    }

    try {
      setLoading(true);

      if (isEdit) {
        await updateIngredient({
          establishmentId,
          ingredientId: ingredient!.id,
          name,
          unitName,
          unitSymbol,
          quantity,
          minimumLimit,
        });
        showToast("Ingrediente atualizado com sucesso!", "success");
      } else {
        await createIngredient({
          establishmentId,
          name,
          unitName,
          unitSymbol,
          quantity: quantity ?? 0,
          minimumLimit,
        });
        showToast("Ingrediente criado com sucesso!", "success");
      }

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

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-slideInUp">
        
        {/* Header com gradiente */}
        <div className="">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              
              <h2 className="text-xl font-bold text-white">
                {isEdit ? "Editar Ingrediente" : "Novo Ingrediente"}
              </h2>
            </div>
            <button 
              onClick={onClose}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5  " />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Alerta de stock baixo (apenas edição) */}
          {isEdit && isLowStock && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800">Stock baixo!</p>
                <p className="text-xs text-amber-700">
                  Quantidade atual ({quantity} {unitSymbol}) está no/abaixo do limite mínimo ({minimumLimit})
                </p>
              </div>
            </div>
          )}

          {/* Nome */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Package className="w-4 h-4 text-primary" />
              Nome do ingrediente *
            </label>
            <input
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Farinha de Trigo"
            />
          </div>

          {/* Unidade - Nome e Símbolo lado a lado */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Scale className="w-4 h-4 text-primary" />
                Nome da unidade *
              </label>
              <input
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                value={unitName}
                onChange={(e) => setUnitName(e.target.value)}
                placeholder="Ex: Quilograma"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Hash className="w-4 h-4 text-primary" />
                Símbolo da unidade *
              </label>
              <input
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                value={unitSymbol}
                onChange={(e) => setUnitSymbol(e.target.value)}
                placeholder="Ex: kg"
              />
            </div>
          </div>

          {/* Quantidade disponível */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Quantidade disponível
            </label>
            <input
              type="number"
              step="0.001"
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              value={quantity ?? ""}
              onChange={(e) =>
                setQuantity(e.target.value === "" ? undefined : Number(e.target.value))
              }
              placeholder="Ex: 10.5"
            />
            {unitSymbol && quantity !== undefined && (
              <p className="text-xs text-gray-500 mt-1">
                Equivalente a {quantity} {unitSymbol}
              </p>
            )}
          </div>

          {/* Limite mínimo */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-primary" />
              Limite mínimo de estoque
            </label>
            <input
              type="number"
              step="0.001"
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              value={minimumLimit}
              onChange={(e) => setMinimumLimit(Number(e.target.value))}
              placeholder="Ex: 2"
            />
            <p className="text-xs text-gray-400">
              Quando o stock atingir este valor, um alerta será exibido
            </p>
          </div>
        </div>

        {/* Footer com botões */}
        <div className="flex gap-3 p-6 pt-0">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2.5 border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 hover:border-gray-300 transition-all duration-300"
          >
            Cancelar
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading || !name.trim() || !unitName.trim() || !unitSymbol.trim()}
            className="flex-1 bg-gradient-to-r from-primary to-secondary text-white px-4 py-2.5 rounded-xl font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Salvando...
              </>
            ) : (
              <>
                {isEdit ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {isEdit ? "Atualizar" : "Criar Ingrediente"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}