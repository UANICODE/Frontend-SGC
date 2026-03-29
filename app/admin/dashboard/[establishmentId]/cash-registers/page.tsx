"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { useOpenCashRegisters } from "@/hooks/admin /cash-register/useOpenCashRegisters";
import { useCashRegisterSales } from "@/hooks/admin /cash-register/useCashRegisterSales";
import { CashRegisterCard } from "@/components/admin/cards/CashRegisterCard";
import { CashRegisterSalesModal } from "@/components/admin/modals/CashRegisterSalesModal";

export default function CashRegistersPage() {
  const { establishmentId } = useParams<{ establishmentId: string }>();

  const { data, loading } = useOpenCashRegisters(establishmentId);
  const { data: sales, fetch, loading: loadingSales, error } =
    useCashRegisterSales();

  const [selectedCash, setSelectedCash] = useState<string | null>(null);

  const [tab, setTab] = useState<"open" | "closed">("open");
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");

  const openRegisters = useMemo(
    () => data.filter((c) => c.status === "ABERTO"),
    [data]
  );

  const closedRegisters = useMemo(() => {
    return data
      .filter((c) => c.status === "FECHADO")
      .filter((c) =>
        c.attendantName.toLowerCase().includes(search.toLowerCase())
      )
      .filter((c) =>
        date
          ? new Date(c.closedAt || "")
              .toISOString()
              .slice(0, 10) === date
          : true
      );
  }, [data, search, date]);

  const handleDetails = async (cash: any) => {
    setSelectedCash(cash.cashRegisterId);
    await fetch(establishmentId, cash.cashRegisterId);
  };

  const list = tab === "open" ? openRegisters : closedRegisters;

  return (
    <div className="space-y-6">

      <h1 className="text-3xl font-bold">
        Gestão de Caixas
      </h1>

      {/* Tabs */}
      <div className="flex gap-3">
        <button
          onClick={() => setTab("open")}
          className={`px-4 py-2 rounded-lg ${
            tab === "open"
              ? "bg-primary text-white"
              : "bg-gray-200"
          }`}
        >
          Abertos
        </button>

        <button
          onClick={() => setTab("closed")}
          className={`px-4 py-2 rounded-lg ${
            tab === "closed"
              ? "bg-primary text-white"
              : "bg-gray-200"
          }`}
        >
          Fechados
        </button>
      </div>

      {/* Filtros */}
      {tab === "closed" && (
        <div className="flex gap-4">
          <input
            placeholder="Operador"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded-lg"
          />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border p-2 rounded-lg"
          />
        </div>
      )}

      {/* LISTA */}
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {list.map((cash) => (
            <CashRegisterCard
              key={cash.cashRegisterId}
              cash={cash}
              onDetails={handleDetails}
            />
          ))}
        </div>
      )}

      {/* ERRO */}
      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded-lg">
          {error}
        </div>
      )}

      {/* MODAL */}
      <CashRegisterSalesModal
        open={!!selectedCash}
        onClose={() => setSelectedCash(null)}
        sales={sales}
        loading={loadingSales}
      />
    </div>
  );
}