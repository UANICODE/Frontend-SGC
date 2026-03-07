"use client";

import { updateEstablishment } from "@/service/admin/perfil/establishment";
import { uploadProductImage } from "@/utils/uploadProductImage";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useToast } from "@/ context/ToastContext";
import { useEstablishment } from "@/hooks/admin /useEstablishment";
import { UserRole } from "@/enum/enum";
import { useRoleGuard } from "@/hooks/auth/useRoleGuard";


export default function EstablishmentSettings() {
    useRoleGuard([UserRole.ADMIN]);
  const { showToast } = useToast();
  const params = useParams();

  const establishmentId = Array.isArray(params?.establishmentId)
    ? params.establishmentId[0]
    : params?.establishmentId;

  const { data, loading, refresh } = useEstablishment(establishmentId ?? "");

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data) {
      setForm({
        tradeName: data.tradeName,
        email: (data as any).email || "",
        logoUrl: data.logoUrl,
        primaryColor: data.primaryColor,
        secondaryColor: data.secondaryColor,
      });
    }
  }, [data]);

  async function handleSave() {
    if (!form) return;
    try {
      setSaving(true);
      await updateEstablishment({
        tradeName: form.tradeName,
        email: form.email,
        logoUrl: form.logoUrl,
        primaryColor: form.primaryColor,
        secondaryColor: form.secondaryColor,
      });

      showToast("Estabelecimento atualizado com sucesso!", "success");
      setEditing(false);
      refresh();
    } catch (error: any) {
      showToast(error?.message || "Erro ao atualizar estabelecimento", "error");
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    setEditing(false);
    setForm({
      tradeName: data?.tradeName,
      email: (data as any).email || "",
      logoUrl: data?.logoUrl,
      primaryColor: data?.primaryColor,
      secondaryColor: data?.secondaryColor,
    });
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!editing) return;

    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = await uploadProductImage(file);
      setForm((prev: any) => ({ ...prev, logoUrl: url }));
      showToast("Logo atualizado!", "success");
    } catch (error: any) {
      showToast(error.message, "error");
    }
  }

  // ⚡ Loader animado centralizado
  if (loading || !form) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-500">Carregando estabelecimento...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Meu estabelecimento</h1>

        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="bg-primary text-white px-6 py-2 rounded-xl hover:scale-105 transition"
          >
            Editar
          </button>
        ) : (
          <div className="flex gap-4">
            <button onClick={handleCancel} className="px-6 py-2 rounded-xl border">
              Cancelar
            </button>

            <button
              onClick={handleSave}
              disabled={saving}
              className={`bg-primary text-white px-6 py-2 rounded-xl transition ${
                saving ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
              }`}
            >
              {saving ? "Salvando..." : "Salvar"}
            </button>
          </div>
        )}
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-xl space-y-8">
        {/* LOGO */}
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <img
            src={form.logoUrl}
            alt="Logo"
            className="w-40 h-40 object-contain rounded-2xl border"
          />
          {editing && <input type="file" accept="image/*" onChange={handleImageUpload} />}
        </div>

        {/* NOME */}
        <div>
          <label className="block font-medium mb-2">Nome Comercial</label>
          <input
            value={form.tradeName}
            disabled={!editing}
            className="input w-full disabled:bg-gray-100"
            onChange={(e) => setForm({ ...form, tradeName: e.target.value })}
          />
        </div>

        {/* EMAIL */}
        <div>
          <label className="block font-medium mb-2">Email</label>
          <input
            value={form.email}
            disabled={!editing}
            className="input w-full disabled:bg-gray-100"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        {/* CORES */}
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <label className="block font-medium mb-2">Cor Primária</label>
            <div className="flex items-center gap-4">
              <input
                type="color"
                value={form.primaryColor}
                disabled={!editing}
                onChange={(e) => setForm({ ...form, primaryColor: e.target.value })}
                className="w-16 h-16 border-none"
              />
              <div
                className="w-20 h-16 rounded-xl border"
                style={{ backgroundColor: form.primaryColor }}
              />
            </div>
          </div>

          <div>
            <label className="block font-medium mb-2">Cor Secundária</label>
            <div className="flex items-center gap-4">
              <input
                type="color"
                value={form.secondaryColor}
                disabled={!editing}
                onChange={(e) => setForm({ ...form, secondaryColor: e.target.value })}
                className="w-16 h-16 border-none"
              />
              <div
                className="w-20 h-16 rounded-xl border"
                style={{ backgroundColor: form.secondaryColor }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}