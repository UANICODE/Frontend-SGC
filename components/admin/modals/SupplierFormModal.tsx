"use client";

import { useEffect, useState } from "react";
import {
  CreateSupplierRequest,
  SupplierItemResponse,
  UpdateSupplierRequest,
} from "@/types/admin/supplier";
import {
  createSupplier,
  updateSupplier,
} from "@/service/admin/supplier";
import { useToast } from "@/ context/ToastContext";

interface Props {
  establishmentId: string;
  supplier?: SupplierItemResponse | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function SupplierFormModal({
  establishmentId,
  supplier,
  onClose,
  onSuccess,
}: Props) {
  const { showToast } = useToast();

  const isEdit = !!supplier;

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    nuit: "",
    statusId: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (supplier) {
      setForm({
        name: supplier.name,
        email: supplier.email ?? "",
        phone: supplier.phone ?? "",
        address: supplier.address ?? "",
        nuit: supplier.nuit ?? "",
        statusId: supplier.statusId,
      });
    }
  }, [supplier]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit() {
    try {
      setLoading(true);

      if (isEdit && supplier) {
        const payload: UpdateSupplierRequest = {
          establishmentId,
          supplierId: supplier.supplierId,
          ...form,
        };

        await updateSupplier(payload);
        showToast("Fornecedor atualizado com sucesso!", "success");
      } else {
        const payload: CreateSupplierRequest = {
          establishmentId,
          ...form,
        };

        await createSupplier(payload);
        showToast("Fornecedor criado com sucesso!", "success");
      }

      onSuccess(); // 🔥 reload tabela
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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg p-8 space-y-6">
        <h2 className="text-xl font-bold">
          {isEdit ? "Editar Fornecedor" : "Novo Fornecedor"}
        </h2>

        <div className="grid gap-4">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nome"
            className="input"
          />
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="input"
          />
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Telefone"
            className="input"
          />
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Endereço"
            className="input"
          />
          <input
            name="nuit"
            value={form.nuit}
            onChange={handleChange}
            placeholder="NUIT"
            className="input"
          />
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border"
          >
            Cancelar
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 bg-primary text-white rounded-lg"
          >
            {loading ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}