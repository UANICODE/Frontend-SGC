"use client";

import { useState } from "react";
import {
  generateInventoryReport,
  generateSalesReport,
} from "@/service/admin/report";
import { openSalesReportWindow } from "@/utils/reports/salesReportWindow";
import { openInventoryReportWindow } from "@/utils/reports/inventoryReportWindow";
import { useParams } from "next/navigation";
import { useToast } from "@/ context/ToastContext";

export default function ReportsPage() {
  const params = useParams<{ establishmentId: string }>();
  const establishmentId = params.establishmentId;
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState("WEEKLY");

  function getDateRange() {
    const now = new Date();

    if (period === "WEEKLY") {
      const start = new Date();
      start.setDate(now.getDate() - 7);
      return { start, end: now };
    }

    if (period === "MONTHLY") {
      const start = new Date();
      start.setMonth(now.getMonth() - 1);
      return { start, end: now };
    }

    return {
      start: new Date("2000-01-01"),
      end: now,
    };
  }

  async function handleSales() {
    setLoading(true);
    const { start, end } = getDateRange();

    try {
      const data = await generateSalesReport(
        establishmentId,
        start.toISOString(),
        end.toISOString()
      );
        openSalesReportWindow(data);
        showToast("Relatório de vendas gerado com sucesso!", "success");
      } catch (err) {
        showToast("Erro ao gerar relatório de vendas", "error");

          } finally {
      setLoading(false);
    }
  }

  async function handleInventory() {
    setLoading(true);
    try {
      const data = await generateInventoryReport(establishmentId);
      openInventoryReportWindow(data);
      showToast("Relatório de inventário gerado com sucesso!", "success");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-12 animate-fadeIn">
      <h1 className="text-3xl font-bold">Relatórios</h1>

      {/* INVENTÁRIO */}
      <div className="bg-white p-8 rounded-3xl shadow-xl space-y-6 relative">
        {loading && (
          <div className="absolute inset-0 bg-white/70 flex flex-col items-center justify-center rounded-3xl z-10">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Gerando relatório...</p>
          </div>
        )}
        <h2 className="text-xl font-bold">Relatório de Inventário</h2>
        <p className="text-gray-500">
          Gere um relatório completo do estoque atual do estabelecimento.
        </p>

        <button
          onClick={handleInventory}
          disabled={loading}
          className={`bg-primary text-white px-6 py-3 rounded-xl hover:scale-105 transition ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Gerando..." : "Gerar Relatório"}
        </button>
      </div>

      {/* VENDAS */}
      <div className="bg-white p-8 rounded-3xl shadow-xl space-y-6 relative">
        {loading && (
          <div className="absolute inset-0 bg-white/70 flex flex-col items-center justify-center rounded-3xl z-10">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Gerando relatório...</p>
          </div>
        )}
        <h2 className="text-xl font-bold">Relatório de Vendas</h2>
        <p className="text-gray-500">
          Gere relatórios de vendas por período.
        </p>

        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="input"
        >
          <option value="WEEKLY">Semanal</option>
          <option value="MONTHLY">Mensal</option>
          <option value="ALL">Geral</option>
        </select>

        <button
          onClick={handleSales}
          disabled={loading}
          className={`bg-primary text-white px-6 py-3 rounded-xl hover:scale-105 transition ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Gerando..." : "Gerar Relatório"}
        </button>
      </div>
    </div>
  );
}