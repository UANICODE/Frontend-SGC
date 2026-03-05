"use client";

import { useState } from "react";
import { uploadProductImage } from "@/utils/uploadProductImage";
import { useCreateEstablishment } from "@/hooks/superadmin/useCreateEstablishment";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export function CreateEstablishmentModal({
  open,
  onClose,
  onCreated,
}: Props) {
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
      <div className="bg-card w-full max-w-2xl rounded-xl p-6 space-y-6 max-h-[90vh] overflow-y-auto">

        <h2 className="text-xl font-semibold">
          Cadastrar Estabelecimento
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input name="tradeName" placeholder="Nome Comercial" required
            onChange={handleChange}
            className="w-full border rounded-lg p-2 bg-background" />

          <input name="legalName" placeholder="Nome Legal"
            onChange={handleChange}
            className="w-full border rounded-lg p-2 bg-background" />

          <input name="nuit" placeholder="NUIT"
            onChange={handleChange}
            className="w-full border rounded-lg p-2 bg-background" />

          <input name="email" type="email" required
            placeholder="Email"
            onChange={handleChange}
            className="w-full border rounded-lg p-2 bg-background" />

          <input name="phone" placeholder="Telefone"
            onChange={handleChange}
            className="w-full border rounded-lg p-2 bg-background" />

          <input name="address" placeholder="Endereço"
            onChange={handleChange}
            className="w-full border rounded-lg p-2 bg-background" />

          {/* Upload Logo */}
          <div className="space-y-2">
            <label className="text-sm">Logotipo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                e.target.files && handleLogoUpload(e.target.files[0])
              }
            />
            {form.logoUrl && (
              <img
                src={form.logoUrl}
                className="w-20 h-20 object-cover rounded border"
              />
            )}
          </div>

          {/* Paleta de Cores */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm">Cor Primária</label>
              <input
                type="color"
                name="primaryColor"
                value={form.primaryColor}
                onChange={handleChange}
                className="w-full h-10 border rounded"
              />
            </div>

            <div>
              <label className="text-sm">Cor Secundária</label>
              <input
                type="color"
                name="secondaryColor"
                value={form.secondaryColor}
                onChange={handleChange}
                className="w-full h-10 border rounded"
              />
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
            >
              {loading ? "Salvando..." : "Cadastrar"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}