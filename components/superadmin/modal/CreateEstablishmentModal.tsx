"use client";

import { useState } from "react";
import { uploadProductImage } from "@/utils/uploadProductImage";
import { useCreateEstablishment } from "@/hooks/superadmin/useCreateEstablishment";
import { X } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export function CreateEstablishmentModal({ open, onClose, onCreated }: Props) {
  const { create, loading } = useCreateEstablishment(() => {
    onCreated();
    onClose();
  });

  const [form, setForm] = useState({
    tradeName: "",
    legalName: "",
    nuit: "",
    email: "",
    phone: "",
    address: "",
    logoUrl: "",
    primaryColor: "#000000",
    secondaryColor: "#ffffff",
  });

  async function handleLogoUpload(file: File) {
    const url = await uploadProductImage(file);
    setForm((prev) => ({ ...prev, logoUrl: url }));
  }

  function handleChange(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    await create(form);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-2xl rounded-xl p-6 space-y-6 max-h-[90vh] overflow-y-auto shadow-xl">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-900">Cadastrar Estabelecimento</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition">
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <input name="tradeName" placeholder="Nome Comercial" required
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition" />

          <input name="legalName" placeholder="Nome Legal"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition" />

          <input name="nuit" placeholder="NUIT"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition" />

          <input name="email" type="email" required
            placeholder="Email"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition" />

          <input name="phone" placeholder="Telefone"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition" />

          <input name="address" placeholder="Endereço"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition" />

          {/* Upload Logo */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Logotipo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                e.target.files && handleLogoUpload(e.target.files[0])
              }
              className="w-full text-sm text-gray-600"
            />
            {form.logoUrl && (
              <img
                src={form.logoUrl}
                className="w-24 h-24 object-cover rounded-lg border mt-2"
              />
            )}
          </div>

          {/* Paleta de Cores */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Cor Primária</label>
              <input
                type="color"
                name="primaryColor"
                value={form.primaryColor}
                onChange={handleChange}
                className="w-full h-10 rounded-lg border cursor-pointer"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Cor Secundária</label>
              <input
                type="color"
                name="secondaryColor"
                value={form.secondaryColor}
                onChange={handleChange}
                className="w-full h-10 rounded-lg border cursor-pointer"
              />
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
            >
              {loading ? "Salvando..." : "Cadastrar"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}