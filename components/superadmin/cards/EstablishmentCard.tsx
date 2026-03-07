"use client";

import { ListEstablishmentsResponse } from "@/types/superadmin/establishment";
import { Mail, Phone, CheckCircle, XCircle } from "lucide-react";

interface Props {
  establishment: ListEstablishmentsResponse;
}

export function EstablishmentCard({ establishment }: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-4 shadow hover:shadow-lg transition">
      
      {/* Logo + Nome */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-lg overflow-hidden border flex items-center justify-center bg-gray-50 shrink-0">
          {establishment.logoUrl ? (
            <img
              src={establishment.logoUrl}
              alt={establishment.tradeName}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xs text-gray-400">Sem Logo</span>
          )}
        </div>

        <div className="min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{establishment.tradeName}</h3>
          <p className="text-sm text-gray-500 truncate">{establishment.legalName}</p>
        </div>
      </div>

      {/* Informações */}
      <div className="text-sm space-y-1">
        <p className="flex items-center gap-2 truncate">
          <Mail size={14} className="text-gray-400" /> {establishment.email}
        </p>

        <p className="flex items-center gap-2 truncate">
          <Phone size={14} className="text-gray-400" /> {establishment.phone || "-"}
        </p>

        <p className="flex items-center gap-2">
          {establishment.active ? (
            <CheckCircle size={14} className="text-green-500" />
          ) : (
            <XCircle size={14} className="text-red-500" />
          )}
          Status: {establishment.active ? "Ativo" : "Inativo"}
        </p>
      </div>
    </div>
  );
}