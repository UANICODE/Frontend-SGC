"use client";

import { useRouter } from "next/navigation";
import { AttendantEstablishmentItem } from "@/types/attendant/establishment.types";

interface Props {
  establishment: AttendantEstablishmentItem;
}

export function EstablishmentCard({ establishment }: Props) {
  const router = useRouter();

  function handleEnter() {
    localStorage.setItem(
      "attendant_establishment_id",
      establishment.id
    );

    router.push(`/attendant/dashboard/${establishment.id}`);
  }

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-2xl transition transform hover:-translate-y-1">

      <div className="flex items-center gap-6 mb-6">
        <img
          src={establishment.logoUrl}
          alt="Logo"
          className="w-20 h-20 object-contain rounded-xl border"
        />

        <div>
          <h2 className="text-xl font-bold text-primary">
            {establishment.tradeName}
          </h2>
          <p className="text-sm text-gray-500">
            {establishment.address}
          </p>
        </div>
      </div>

      <div className="text-sm text-gray-600 space-y-1 mb-6">
        <p>Email: {establishment.email}</p>
        <p>Telefone: {establishment.phone}</p>
        <p>Status: {establishment.status}</p>
      </div>

      <button
        onClick={handleEnter}
        disabled={!establishment.active}
        className="w-full bg-primary text-white py-3 rounded-xl hover:opacity-90 transition disabled:bg-gray-300"
      >
        Entrar
      </button>
    </div>
  );
}