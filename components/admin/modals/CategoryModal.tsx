// components/admin/modals/CategoryModal.tsx
"use client";

import { useState } from "react";
import {
  createCategory,
  updateCategory,
} from "@/service/admin/categories";
import { CategoryItemResponse } from "@/types/admin/categories";
import { useToast } from "@/ context/ToastContext";

interface Props {
  establishmentId: string;
  category: CategoryItemResponse | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function CategoryModal({
  establishmentId,
  category,
  onClose,
  onSuccess,
}: Props) {
  const { showToast } = useToast();

  const [name, setName] = useState(category?.name ?? "");
  const [description, setDescription] = useState(category?.description ?? "");
  const [isKitchen, setIsKitchen] = useState(category?.isKitchen ?? false);
  const [loading, setLoading] = useState(false);

  const isEdit = !!category;

  async function handleSubmit() {
    if (!name.trim()) {
      showToast("Nome é obrigatório.", "error");
      return;
    }

    try {
      setLoading(true);

      if (isEdit) {
        await updateCategory({
          establishmentId,
          categoryId: category!.id,
          name,
          description,
          isKitchen,
        });

        showToast("Categoria atualizada com sucesso!", "success");
      } else {
        await createCategory({
          establishmentId,
          name,
          description,
          isKitchen,
        });

        showToast("Categoria criada com sucesso!", "success");
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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-2xl space-y-6">
        <h2 className="text-xl font-bold text-primary">
          {isEdit ? "Editar Categoria" : "Nova Categoria"}
        </h2>

        <input
          className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
          placeholder="Nome *"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <textarea
          className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
          placeholder="Descrição"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* 🆕 Checkbox para marcar como cozinha */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isKitchen"
            checked={isKitchen}
            onChange={(e) => setIsKitchen(e.target.checked)}
            className="w-5 h-5 text-primary rounded focus:ring-primary"
          />
          <label htmlFor="isKitchen" className="text-gray-700 font-medium">
            🍳 Marcar como categoria da cozinha
          </label>
        </div>
        <p className="text-xs text-gray-500 -mt-2 ml-7">
          Produtos desta categoria serão impressos no recibo da cozinha
        </p>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition"
          >
            Cancelar
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={handleSubmit}
            className="bg-primary text-white px-5 py-2 rounded-lg disabled:opacity-50 hover:brightness-90 transition"
          >
            {loading ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}