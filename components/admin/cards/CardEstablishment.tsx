"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ListAdminEstablishmentsResponse } from "@/types/admin/AdminEstablishment";
import { CheckCircleIcon, XCircleIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";

interface Props {
  establishment: ListAdminEstablishmentsResponse;
}

export function CardEstablishment({ establishment }: Props) {
  const router = useRouter();

  async function handleManage() {
    router.push(`/admin/dashboard/${establishment.id}`);
  }

  return (
    <div className="bg-white border border-borderLight rounded-xl p-6 shadow-sm hover:shadow-md transition">
      
      {/* HEADER COM LOGO */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-14 h-14 relative rounded-lg overflow-hidden border border-borderLight bg-gray-50">
          {establishment.urlImage ? (
            <Image
              src={establishment.urlImage}
              alt={`Logo ${establishment.tradeName}`}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-xs text-gray-400">
              Logo
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold">{establishment.tradeName}</h2>
          <p className="text-sm text-textSecondaryLight">{establishment.email}</p>
        </div>
      </div>

      {/* STATUS */}
      <p className="text-sm mb-4 flex items-center gap-2">
        Status:{" "}
        {establishment.active ? (
          <>
            <CheckCircleIcon className="w-5 h-5 text-green-600" /> 
            <span className="text-green-600 font-medium">Ativo</span>
          </>
        ) : (
          <>
            <XCircleIcon className="w-5 h-5 text-red-600" /> 
            <span className="text-red-600 font-medium">Inativo</span>
          </>
        )}
      </p>

      {/* BOTÃO */}
      <button
        onClick={handleManage}
        className="bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition flex items-center justify-center gap-2"
      >
        Gerir <Cog6ToothIcon className="w-5 h-5" />
      </button>
    </div>
  );
}