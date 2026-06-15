"use client";

import { useToast } from "@/ context/ToastContext";
import { createProductType, updateProductType } from "@/service/admin/product-types";
import { ProductTypeResponse } from "@/types/admin/product-types";
import { useState } from "react";
import { Layers, X, Plus, Save, Tag, AlignLeft } from "lucide-react";

interface Props {
  establishmentId: string;
  type: ProductTypeResponse | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function ProductTypeModal({
  establishmentId,
  type,
  onClose,
  onSuccess,
}: Props) {
  const { showToast } = useToast();

  const [name, setName] = useState(type?.name ?? "");
  const [description, setDescription] = useState(type?.description ?? "");
  const [loading, setLoading] = useState(false);

  const isEdit = !!type;

  async function handleSubmit() {
    if (!name.trim()) {
      showToast("Nome é obrigatório.", "error");
      return;
    }

    try {
      setLoading(true);

      if (isEdit) {
        await updateProductType({
          establishmentId,
          productTypeId: type!.id,
          name,
          description,
        });
        showToast("Tipo atualizado com sucesso!", "success");
      } else {
        await createProductType({
          establishmentId,
          name,
          description,
        });
        showToast("Tipo criado com sucesso!", "success");
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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-slideInUp">
        
        {/* Header com gradiente */}
        <div className="">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                {isEdit ? (
                  <Layers className="w-5 h-5 text-white" />
                ) : (
                  <Plus className="w-5 h-5 text-white" />
                )}
              </div>
              <h2 className="text-xl font-bold text-white">
                {isEdit ? "Editar Tipo de Produto" : "Novo Tipo de Produto"}
              </h2>
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
          {/* Informação */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-start gap-2">
            <Layers className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700">
              Tipos de produto ajudam a classificar seus produtos (ex: Alimentício, Bebida, Higiene, etc.)
            </p>
          </div>

          {/* Nome */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Tag className="w-4 h-4 text-primary" />
              Nome do tipo *
            </label>
            <input
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Alimentício, Bebida, Higiene"
              autoFocus
            />
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <AlignLeft className="w-4 h-4 text-primary" />
              Descrição (opcional)
            </label>
            <textarea
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva brevemente este tipo de produto..."
              rows={3}
            />
            <p className="text-xs text-gray-400">
              Uma descrição ajuda a identificar melhor a classificação
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
            disabled={loading || !name.trim()}
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
                {isEdit ? "Atualizar" : "Criar Tipo"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}