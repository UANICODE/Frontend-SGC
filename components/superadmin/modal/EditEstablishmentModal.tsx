"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";

import {
  Building2,
  ImagePlus,
  Save,
  Trash2,
  X,
} from "lucide-react";

import { useEditEstablishment } from "@/hooks/superadmin/establishments/useEditEstablishment";
import { EstablishmentListItemResponse } from "@/types/superadmin/establishments/listEstablishments";
import { BusinessTypeItemResponse } from "@/types/superadmin/establishments/listBusinessTypes";
import { uploadProductImage } from "@/utils/uploadProductImage";
import { useToast } from "@/ context/ToastContext";

interface EditEstablishmentModalProps {
  establishment: EstablishmentListItemResponse | null;
  businessTypes: BusinessTypeItemResponse[];
  onClose: () => void;
  onUpdated: () => Promise<void> | void;
}

const inputClass =
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100";

export function EditEstablishmentModal({
  establishment,
  businessTypes,
  onClose,
  onUpdated,
}: EditEstablishmentModalProps) {
  const [form, setForm] = useState({
    tradeName: "",
    legalName: "",
    nuit: "",
    email: "",
    phone: "",
    address: "",
    logoUrl: "",
    primaryColor: "#2563EB",
    secondaryColor: "#06B6D4",
    businessTypeId: "",
  });

  const [uploadingLogo, setUploadingLogo] =
    useState(false);

  const { execute, loading } =
    useEditEstablishment();

  const { showToast } = useToast();

  useEffect(() => {
    if (!establishment) {
      return;
    }

    setForm({
      tradeName: establishment.tradeName,
      legalName: establishment.legalName || "",
      nuit: establishment.nuit || "",
      email: establishment.email,
      phone: establishment.phone || "",
      address: establishment.address || "",
      logoUrl: establishment.logoUrl || "",
      primaryColor:
        establishment.primaryColor || "#2563EB",
      secondaryColor:
        establishment.secondaryColor || "#06B6D4",
      businessTypeId:
        establishment.businessTypeId || "",
    });
  }, [establishment]);

  if (!establishment) {
    return null;
  }

  function updateField(
    field: keyof typeof form,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleLogoUpload(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setUploadingLogo(true);

      const logoUrl = await uploadProductImage(file);

      updateField("logoUrl", logoUrl);

      showToast(
        "Logotipo carregado com sucesso!",
        "success"
      );
    } catch (error: any) {
      showToast(
        error?.message ||
          "Não foi possível carregar o logotipo.",
        "error"
      );
    } finally {
      setUploadingLogo(false);
      event.target.value = "";
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!establishment) {
      showToast(
        "Estabelecimento não encontrado.",
        "error"
      );
      return;
    }

    try {
      const response = await execute(
        establishment.id,
        {
          tradeName: form.tradeName,
          legalName: form.legalName || null,
          nuit: form.nuit || null,
          email: form.email,
          phone: form.phone || null,
          address: form.address || null,
          logoUrl: form.logoUrl || null,
          primaryColor: form.primaryColor,
          secondaryColor: form.secondaryColor,
          businessTypeId: form.businessTypeId,
        }
      );

      showToast(response.message, "success");

      onClose();
      await onUpdated();
    } catch (error: any) {
      showToast(
        error?.message ||
          "Não foi possível editar o estabelecimento.",
        "error"
      );
    }
  }

  const processing = loading || uploadingLogo;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Fechar modal"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
      />

      <div className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="sticky top-0 z-20 flex items-start justify-between border-b border-slate-200 bg-white px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-100 p-3">
              <Building2 className="h-6 w-6 text-blue-700" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Editar estabelecimento
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {establishment.tradeName}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={processing}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 p-6"
        >
          <section>
            <h3 className="mb-4 font-semibold text-slate-900">
              Identificação
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Nome comercial
                </label>

                <input
                  required
                  minLength={2}
                  maxLength={150}
                  value={form.tradeName}
                  onChange={(event) =>
                    updateField(
                      "tradeName",
                      event.target.value
                    )
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Nome legal
                </label>

                <input
                  maxLength={200}
                  value={form.legalName}
                  onChange={(event) =>
                    updateField(
                      "legalName",
                      event.target.value
                    )
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  NUIT
                </label>

                <input
                  maxLength={30}
                  value={form.nuit}
                  onChange={(event) =>
                    updateField(
                      "nuit",
                      event.target.value
                    )
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Tipo de negócio
                </label>

                <select
                  required
                  value={form.businessTypeId}
                  onChange={(event) =>
                    updateField(
                      "businessTypeId",
                      event.target.value
                    )
                  }
                  className={inputClass}
                >
                  <option value="">
                    Selecione o tipo de negócio
                  </option>

                  {businessTypes.map((businessType) => (
                    <option
                      key={businessType.id}
                      value={businessType.id}
                    >
                      {businessType.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <section className="border-t border-slate-200 pt-6">
            <h3 className="mb-4 font-semibold text-slate-900">
              Contacto
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  E-mail
                </label>

                <input
                  required
                  type="email"
                  maxLength={150}
                  value={form.email}
                  onChange={(event) =>
                    updateField(
                      "email",
                      event.target.value
                    )
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Telefone
                </label>

                <input
                  maxLength={30}
                  value={form.phone}
                  onChange={(event) =>
                    updateField(
                      "phone",
                      event.target.value
                    )
                  }
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Endereço
                </label>

                <input
                  maxLength={255}
                  value={form.address}
                  onChange={(event) =>
                    updateField(
                      "address",
                      event.target.value
                    )
                  }
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          <section className="border-t border-slate-200 pt-6">
            <h3 className="mb-4 font-semibold text-slate-900">
              Logotipo
            </h3>

            <div className="flex flex-col gap-5 rounded-xl border border-slate-200 bg-slate-50 p-5 sm:flex-row sm:items-center">
              <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white">
                {form.logoUrl ? (
                  <img
                    src={form.logoUrl}
                    alt={form.tradeName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Building2 className="h-10 w-10 text-slate-300" />
                )}
              </div>

              <div className="flex-1">
                <p className="text-sm font-medium text-slate-800">
                  Imagem do estabelecimento
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Formatos de imagem, máximo de 5 MB.
                </p>

                <div className="mt-4 flex flex-wrap gap-3">
                  <label className="flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
                    <ImagePlus size={17} />

                    {uploadingLogo
                      ? "A carregar..."
                      : "Selecionar imagem"}

                    <input
                      type="file"
                      accept="image/*"
                      disabled={processing}
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>

                  {form.logoUrl && (
                    <button
                      type="button"
                      disabled={processing}
                      onClick={() =>
                        updateField("logoUrl", "")
                      }
                      className="flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={17} />
                      Remover logotipo
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className="border-t border-slate-200 pt-6">
            <h3 className="mb-4 font-semibold text-slate-900">
              Identidade visual
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Cor primária
                </label>

                <div className="flex items-center gap-3 rounded-xl border border-slate-300 p-2">
                  <input
                    type="color"
                    value={form.primaryColor}
                    onChange={(event) =>
                      updateField(
                        "primaryColor",
                        event.target.value
                      )
                    }
                    className="h-10 w-14 cursor-pointer rounded-lg border-0 bg-transparent"
                  />

                  <span className="text-sm font-medium uppercase text-slate-700">
                    {form.primaryColor}
                  </span>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Cor secundária
                </label>

                <div className="flex items-center gap-3 rounded-xl border border-slate-300 p-2">
                  <input
                    type="color"
                    value={form.secondaryColor}
                    onChange={(event) =>
                      updateField(
                        "secondaryColor",
                        event.target.value
                      )
                    }
                    className="h-10 w-14 cursor-pointer rounded-lg border-0 bg-transparent"
                  />

                  <span className="text-sm font-medium uppercase text-slate-700">
                    {form.secondaryColor}
                  </span>
                </div>
              </div>
            </div>
          </section>

          <div className="sticky bottom-0 flex justify-end gap-3 border-t border-slate-200 bg-white pt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={processing}
              className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={
                processing || !form.businessTypeId
              }
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save size={18} />

              {loading
                ? "A guardar..."
                : "Guardar alterações"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}