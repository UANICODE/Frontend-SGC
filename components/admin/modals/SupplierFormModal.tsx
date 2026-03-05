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
    nuit: ""

  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (supplier) {
      setForm({
        name: supplier.name,
        email: supplier.email ?? "",
        phone: supplier.phone ?? "",
        address: supplier.address ?? "",
        nuit: supplier.nuit ?? ""
      });
    }
  }, [supplier]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit() {
    try {
      setLoading(true);

      if (isEdit && supplier) {
        const payload: UpdateSupplierRequest = {
          establishmentId,
          supplierId: supplier.id,
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

      onSuccess();
      onClose();
    } catch (error) {
      if (error instanceof Error) showToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-lg p-8 space-y-6 shadow-lg relative animate-fadeIn">
        <h2 className="text-2xl font-bold text-gray-800">
          {isEdit ? "Editar Fornecedor" : "Novo Fornecedor"}
        </h2>

        <div className="grid gap-4">
          {[
            { name: "name", placeholder: "Nome" },
            { name: "email", placeholder: "Email" },
            { name: "phone", placeholder: "Telefone" },
            { name: "address", placeholder: "Endereço" },
            { name: "nuit", placeholder: "NUIT" },
          ].map((field) => (
            <input
              key={field.name}
              name={field.name}
              value={form[field.name as keyof typeof form]}
              onChange={handleChange}
              placeholder={field.placeholder}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
            />
          ))}
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition"
          >
            Cancelar
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 bg-primary text-white rounded-lg flex items-center gap-2 justify-center hover:bg-primary/90 transition"
          >
            {loading && (
              <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin" />
            )}
            <span>{loading ? "Salvando..." : "Salvar"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}