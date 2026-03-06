"use client";

import { useRouter } from "next/navigation";
import { AttendantEstablishmentItem } from "@/types/attendant/establishment.types";
import { EnvelopeIcon, PhoneIcon, CheckCircleIcon, XCircleIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

interface Props {
  establishment: AttendantEstablishmentItem;
}

export function EstablishmentCard({ establishment }: Props) {
  const router = useRouter();

  function handleEnter() {
    localStorage.setItem("attendant_establishment_id", establishment.id);
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

      <div className="text-sm text-gray-600 space-y-2 mb-6">
        <p className="flex items-center gap-2">
          <EnvelopeIcon className="w-4 h-4 text-gray-400" /> {establishment.email}
        </p>
        <p className="flex items-center gap-2">
          <PhoneIcon className="w-4 h-4 text-gray-400" /> {establishment.phone}
        </p>
        <p className="flex items-center gap-2">
          {establishment.active ? (
            <CheckCircleIcon className="w-4 h-4 text-green-600" />
          ) : (
            <XCircleIcon className="w-4 h-4 text-red-600" />
          )}
          Status: {establishment.status}
        </p>
      </div>

      <button
        onClick={handleEnter}
        disabled={!establishment.active}
        className="w-full bg-primary text-white py-3 rounded-xl hover:opacity-90 transition disabled:bg-gray-300 flex justify-center items-center gap-2"
      >
        Entrar <ArrowRightIcon className="w-5 h-5" />
      </button>
    </div>
  );
}