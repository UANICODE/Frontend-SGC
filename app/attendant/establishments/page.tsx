"use client";

import { useAttendantEstablishments } from "@/hooks/attendant/useAttendantEstablishments";
import { EstablishmentCard } from "@/components/attendant/cards/EstablishmentCard";
import { PageLoader } from "@/components/ui/PageLoader";
import { UserRole } from "@/enum/enum";
import { useRoleGuard } from "@/hooks/auth/useRoleGuard";
import {
  Building2,
  Store,
  Sparkles,
} from "lucide-react";


export default function AttendantEstablishmentsPage() {
  useRoleGuard([UserRole.ATENDENTE]);

  const { data, loading } = useAttendantEstablishments();

  if (loading) return <PageLoader />;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary/5 p-6 md:p-10 animate-fadeIn">

      {/* HEADER */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-primary/80 p-8 text-white shadow-xl">

        <div className="relative z-10">

          <div className="flex items-center gap-3 mb-3">
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur">
              <Store size={28}/>
            </div>

            <span className="text-sm bg-white/20 px-4 py-1 rounded-full">
              Área do Atendente
            </span>
          </div>


          <h1 className="text-3xl md:text-4xl font-bold">
            Estabelecimentos onde você trabalha
          </h1>

          <p className="mt-3 text-white/80 max-w-xl">
            Aqui estão todos os estabelecimentos aos quais você tem acesso como atendente.
          </p>


          <div className="mt-6 flex gap-4 flex-wrap">

            <div className="bg-white/15 backdrop-blur px-5 py-3 rounded-2xl">
              <p className="text-sm text-white/70">
                Total
              </p>

              <p className="text-2xl font-bold">
                {data.length}
              </p>
            </div>


            <div className="bg-white/15 backdrop-blur px-5 py-3 rounded-2xl flex items-center gap-2">

              <Sparkles size={20}/>

              <div>
                <p className="text-sm text-white/70">
                  Status
                </p>

                <p className="font-semibold">
                 Ativo
                </p>
              </div>

            </div>

          </div>

        </div>


        {/* decoração */}
        <div className="absolute -right-10 -top-10 w-60 h-60 rounded-full bg-white/10"/>
        <div className="absolute right-20 bottom-0 w-32 h-32 rounded-full bg-white/10"/>

      </section>



      {/* CONTEÚDO */}

      <section className="mt-10">


        {data.length === 0 ? (

          <div className="
            bg-white 
            rounded-3xl 
            shadow-lg 
            border 
            p-12 
            flex 
            flex-col 
            items-center 
            text-center
          ">

            <div className="bg-primary/10 p-5 rounded-full mb-5">

              <Building2 
                size={45}
                className="text-primary"
              />

            </div>


            <h2 className="text-xl font-bold text-gray-800">
              Nenhum estabelecimento encontrado
            </h2>


            <p className="text-gray-500 mt-2 max-w-md">
              Você ainda não possui estabelecimentos associados.
              Contacte o administrador para obter acesso.
            </p>


          </div>


        ) : (


          <div className="
            grid 
            gap-8 
            sm:grid-cols-1 
            md:grid-cols-2 
            xl:grid-cols-3
          ">

            {data.map((est) => (

              <div
                key={est.id}
                className="
                  transition-all 
                  duration-300 
                  hover:-translate-y-2 
                  hover:shadow-2xl
                "
              >

                <EstablishmentCard
                  establishment={est}
                />

              </div>

            ))}

          </div>


        )}

      </section>

    </main>
  );
}