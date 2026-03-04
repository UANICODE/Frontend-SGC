"use client";

import { useToast } from "@/ context/ToastContext";
import { createProductType, updateProductType } from "@/service/admin/product-types";
import { ProductTypeResponse } from "@/types/admin/product-types";
import { useState } from "react";

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
  const [description, setDescription] =
    useState(type?.description ?? "");
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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-2xl space-y-6">
        <h2 className="text-xl font-bold text-primary">
          {isEdit ? "Editar Tipo" : "Novo Tipo"}
        </h2>

        <input
          className="w-full border p-3 rounded-lg"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <textarea
          className="w-full border p-3 rounded-lg"
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="flex justify-end gap-4">
          <button
            disabled={loading}
            onClick={onClose}
          >
            Cancelar
          </button>

          <button
            disabled={loading}
            onClick={handleSubmit}
            className="bg-primary text-white px-5 py-2 rounded-lg disabled:opacity-50"
          >
            {loading ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}