"use client";

import { useState } from "react";
import {
  generateInventoryReport,
  generateSalesReport,
} from "@/service/admin/report";
import { openSalesReportWindow } from "@/utils/reports/salesReportWindow";
import { openInventoryReportWindow } from "@/utils/reports/inventoryReportWindow";

export default function ReportsPage({ params }: any) {
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

    const data = await generateSalesReport(
      params.establishmentId,
      start.toISOString(),
      end.toISOString()
    );

    openSalesReportWindow(data);
    setLoading(false);
  }

  async function handleInventory() {
    setLoading(true);

    const data = await generateInventoryReport(
      params.establishmentId
    );

    openInventoryReportWindow(data);
    setLoading(false);
  }

  return (
    <div className="space-y-12 animate-fadeIn">
      <h1 className="text-3xl font-bold">Relatórios</h1>

      {/* INVENTÁRIO */}
      <div className="bg-white p-8 rounded-3xl shadow-xl space-y-6">
        <h2 className="text-xl font-bold">Relatório de Inventário</h2>
        <p className="text-gray-500">
          Gere um relatório completo do estoque atual do
          estabelecimento.
        </p>

        <button
          onClick={handleInventory}
          className="bg-primary text-white px-6 py-3 rounded-xl"
        >
          Gerar Relatório
        </button>
      </div>

      {/* VENDAS */}
      <div className="bg-white p-8 rounded-3xl shadow-xl space-y-6">
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
          className="bg-primary text-white px-6 py-3 rounded-xl"
        >
          Gerar Relatório
        </button>
      </div>
    </div>
  );
}