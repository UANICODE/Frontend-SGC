"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { CheckCircleIcon, XCircleIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";

export function CardEstablishment({ establishment }: any) {
  const router = useRouter();

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border">

      {/* HEADER */}
      <div className="flex items-center gap-4 mb-5">
        <div className="w-16 h-16 relative rounded-xl overflow-hidden bg-gray-100">
          {establishment.urlImage ? (
            <Image
              src={establishment.urlImage}
              alt={establishment.tradeName}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-xs">
              Logo
            </div>
          )}
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            {establishment.tradeName}
          </h2>
          <p className="text-sm text-gray-400">{establishment.email}</p>
        </div>
      </div>

      {/* STATUS */}
      <div className="mb-6">
        {establishment.active ? (
          <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
            <CheckCircleIcon className="w-5 h-5" />
            Ativo
          </div>
        ) : (
          <div className="flex items-center gap-2 text-red-500 text-sm font-medium">
            <XCircleIcon className="w-5 h-5" />
            Inativo
          </div>
        )}
      </div>

      {/* ACTION */}
      <button
        onClick={() => router.push(`/admin/dashboard/${establishment.id}`)}
        className="w-full bg-primary text-white py-2 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition"
      >
        Gerir <Cog6ToothIcon className="w-5 h-5" />
      </button>

    </div>
  );
}