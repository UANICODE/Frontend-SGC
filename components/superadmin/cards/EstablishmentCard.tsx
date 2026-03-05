"use client";

import Link from "next/link";
import { ListEstablishmentsResponse } from "@/types/superadmin/establishment";

interface Props {
  establishment: ListEstablishmentsResponse;
}

export function EstablishmentCard({ establishment }: Props) {
  return (
    <div className="bg-card border rounded-xl p-5 flex flex-col gap-4">

      {/* Logo + Nome */}
      <div className="flex items-center gap-4">

        <div className="w-16 h-16 rounded-lg overflow-hidden border flex items-center justify-center bg-muted shrink-0">
          {establishment.logoUrl ? (
            <img
              src={establishment.logoUrl}
              alt={establishment.tradeName}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xs text-muted-foreground">
              Sem Logo
            </span>
          )}
        </div>

        <div className="min-w-0">
          <h3 className="font-semibold truncate">
            {establishment.tradeName}
          </h3>
          <p className="text-sm text-muted-foreground truncate">
            {establishment.legalName}
          </p>
        </div>
      </div>

      {/* Informações */}
      <div className="text-sm space-y-1">
        <p className="truncate">
          <span className="text-muted-foreground">Email:</span>{" "}
          {establishment.email}
        </p>

        <p className="truncate">
          <span className="text-muted-foreground">Telefone:</span>{" "}
          {establishment.phone || "-"}
        </p>

        <p>
          <span className="text-muted-foreground">Status:</span>{" "}
          {establishment.status}
        </p>

        <p>
          <span className="text-muted-foreground">Ativo:</span>{" "}
          {establishment.active ? "Sim" : "Não"}
        </p>
      </div>

      {/* Botão */}
      <Link
        href={`/superadmin/establishments/${establishment.id}`}
        className="mt-2 inline-block text-center bg-primary text-primary-foreground py-2 rounded-lg text-sm font-medium hover:opacity-90 transition"
      >
        Ver Detalhes
      </Link>

    </div>
  );
}