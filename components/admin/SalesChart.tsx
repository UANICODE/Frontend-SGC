"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function SalesChart({ data }: any) {
  return (
    <div className="bg-white p-4 rounded shadow h-[350px]">
      <h2 className="font-bold mb-4">Vendas por Estabelecimento</h2>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="establishmentName" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="totalSales" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}