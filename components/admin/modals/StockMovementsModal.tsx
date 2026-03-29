"use client";

import { useMemo, useState } from "react";
import {
  X,
  Package,
  Calendar,
  User,
  Filter,
  ArrowUpDown,
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Cell,
} from "recharts";

export function StockMovementsModal({
  open,
  onClose,
  data = [],
  loading,
}: any) {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [user, setUser] = useState("");
  const [date, setDate] = useState("");

  // 🎨 ESTILO POR TIPO
  const getTypeStyle = (movementType: string) => {
    const t = movementType?.toLowerCase() || "";

    if (t.includes("entrada"))
      return { color: "text-green-600", bg: "bg-green-100", border: "border-l-green-500", sign: "+" };

    if (t.includes("saida"))
      return { color: "text-red-600", bg: "bg-red-100", border: "border-l-red-500", sign: "-" };

    if (t.includes("venda"))
      return { color: "text-orange-600", bg: "bg-orange-100", border: "border-l-orange-500", sign: "-" };

    if (t.includes("transfer"))
      return { color: "text-blue-600", bg: "bg-blue-100", border: "border-l-blue-500", sign: "↔" };

    return { color: "text-gray-600", bg: "bg-gray-100", border: "border-l-gray-400", sign: "" };
  };

  const getBarColor = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes("entrada")) return "#16a34a";
    if (t.includes("saída") || t.includes("saida")) return "#dc2626";
    if (t.includes("venda")) return "#ea580c";
    if (t.includes("transfer")) return "#2563eb";
    return "#6b7280";
  };

  // 🔍 FILTRO
  const filtered = useMemo(() => {
    return data.filter((m: any) => {
      return (
        m.productName.toLowerCase().includes(search.toLowerCase()) &&
        (type ? m.movementType === type : true) &&
        (user ? m.responsibleUser.toLowerCase().includes(user.toLowerCase()) : true) &&
        (date
          ? new Date(m.createdAt).toISOString().slice(0, 10) === date
          : true)
      );
    });
  }, [data, search, type, user, date]);

  // 📊 GRÁFICO POR TIPO (ROBUSTO)
  const chartByType = useMemo(() => {
    const base = {
      ENTRADA: 0,
      SAIDA: 0,
      VENDA: 0,
      TRANSFERENCIA: 0,
    };

    filtered.forEach((m: any) => {
      const t = m.movementType?.toUpperCase().trim();

      if (t.includes("ENTRADA")) base.ENTRADA += Number(m.quantity);
      else if (t.includes("SAIDA")) base.SAIDA -= Number(m.quantity);
      else if (t.includes("VENDA")) base.VENDA -= Number(m.quantity);
      else if (t.includes("TRANSFER")) base.TRANSFERENCIA += Number(m.quantity);
    });

    return [
      { type: "Entrada", total: base.ENTRADA },
      { type: "Saída", total: base.SAIDA },
      { type: "Venda", total: base.VENDA },
      { type: "Transferência", total: base.TRANSFERENCIA },
    ];
  }, [filtered]);

  // 📈 GRÁFICO POR DATA
  const chartByDate = useMemo(() => {
    const map: Record<string, number> = {};

    filtered.forEach((m: any) => {
      const d = new Date(m.createdAt).toISOString().slice(0, 10);

      const t = m.movementType?.toLowerCase() || "";
      const value =
        t.includes("entrada") || t.includes("transfer")
          ? Number(m.quantity)
          : -Number(m.quantity);

      map[d] = (map[d] || 0) + value;
    });

    return Object.keys(map)
      .sort()
      .map((d) => ({
        date: d,
        total: map[d],
      }));
  }, [filtered]);

  const types = useMemo(() => {
    return [...new Set(data.map((d: any) => d.movementType))] as string[];
  }, [data]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-7xl rounded-2xl p-6 max-h-[90vh] overflow-y-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex gap-2 items-center">
            <Package /> Movimentos de Stock
          </h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* FILTROS */}
        <div className="bg-gray-50 p-4 rounded-xl mb-6 space-y-3">
          <div className="flex gap-2 items-center font-semibold">
            <Filter size={16} /> Filtros
          </div>

          <div className="grid md:grid-cols-4 gap-3">
            <input
              placeholder="Produto"
              className="input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className="input"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="">Tipo</option>
              {types.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>

            <input
              placeholder="Operador"
              className="input"
              value={user}
              onChange={(e) => setUser(e.target.value)}
            />

            <input
              type="date"
              className="input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <button
            onClick={() => {
              setSearch("");
              setType("");
              setUser("");
              setDate("");
            }}
            className="text-sm text-primary underline"
          >
            Limpar filtros
          </button>
        </div>

        {/* GRÁFICOS */}
        {!loading && filtered.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6 mb-6">

            {/* BAR */}
            <div className="bg-white p-4 rounded-xl shadow">
              <h3 className="font-semibold mb-3">
                Por tipo de movimentação
              </h3>

              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartByType}>
                  <XAxis dataKey="type" />
                  <Tooltip />

                  <Bar dataKey="total">
                    {chartByType.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={getBarColor(entry.type)}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* LINE */}
            <div className="bg-white p-4 rounded-xl shadow">
              <h3 className="font-semibold mb-3">
                Evolução no tempo
              </h3>

              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartByDate}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#16a34a"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="flex justify-center py-10">
            <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        )}

        {/* EMPTY */}
        {!loading && filtered.length === 0 && (
          <p className="text-center text-gray-500">
            Nenhuma movimentação encontrada
          </p>
        )}

        {/* LIST */}
        <div className="space-y-4">
          {filtered.map((m: any, i: number) => {
            const style = getTypeStyle(m.movementType);

            return (
              <div
                key={i}
                className={`p-4 rounded-xl shadow-sm border-l-4 ${style.border} bg-white hover:shadow-md transition`}
              >
                <div className="flex justify-between">
                  <p className="font-bold text-lg">
                    {m.productName}
                  </p>

                  <span className={`font-bold text-lg ${style.color}`}>
                    {style.sign} {m.quantity}
                  </span>
                </div>

                <div className="mt-2">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${style.bg} ${style.color}`}>
                    {m.movementType}
                  </span>
                </div>

                <div className="text-sm text-gray-500 mt-3 flex gap-4 flex-wrap">
                  <span className="flex items-center gap-1">
                    <User size={14} /> {m.responsibleUser}
                  </span>

                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {new Date(m.createdAt).toLocaleString()}
                  </span>
                </div>

                <div className="mt-3 flex items-center gap-2 text-sm">
                  <span className="text-red-500 font-medium">
                    {m.quantityBefore}
                  </span>

                  <ArrowUpDown size={14} className="text-gray-400" />

                  <span className="text-green-600 font-bold">
                    {m.quantityAfter}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}