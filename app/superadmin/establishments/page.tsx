"use client";

import { useState } from "react";
import { EstablishmentCard } from "@/components/superadmin/cards/EstablishmentCard";
import { useListEstablishments } from "@/hooks/superadmin/useListEstablishments";
import { CreateEstablishmentModal } from "@/components/superadmin/modal/CreateEstablishmentModal";


export default function ListEstablishmentsPage() {
  const { data, loading } = useListEstablishments();
  const [open, setOpen] = useState(false);

  if (loading) {
    return <p>Carregando estabelecimentos...</p>;
  }

  return (
    <div className="space-y-8">

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">
            Estabelecimentos
          </h1>
          <p className="text-muted-foreground">
            Lista de todos os estabelecimentos cadastrados
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg"
        >
          Cadastrar estabelecimento
        </button>
      </div>

      {data.length === 0 ? (
        <div className="bg-card border rounded-xl p-8 text-center text-muted-foreground">
          Nenhum estabelecimento encontrado.
        </div>
      ) : (
        <div className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-4
          gap-6
        ">
          {data.map((establishment) => (
            <EstablishmentCard
              key={establishment.id}
              establishment={establishment}
            />
          ))}
        </div>
      )}

      <CreateEstablishmentModal
        open={open}
        onClose={() => setOpen(false)}
        onCreated={() => window.location.reload()}
      />

    </div>
  );
}