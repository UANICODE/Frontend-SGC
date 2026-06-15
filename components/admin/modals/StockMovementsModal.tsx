"use client";

import { useMemo, useState } from "react";
import {
  X,
  Package,
  Calendar,
  User,
  Filter,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Repeat,
  ShoppingBag,
  BarChart3,
  LineChart as LineChartIcon,
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
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<"list" | "charts">("list");
  const itemsPerPage = 10;

  const getTypeStyle = (movementType: string) => {
    const t = movementType?.toLowerCase() || "";

    if (t.includes("entrada"))
      return { 
        color: "text-green-600", 
        bg: "bg-green-50", 
        border: "border-l-green-500", 
        sign: "+",
        icon: TrendingUp,
        gradient: "from-green-500 to-emerald-500"
      };

    if (t.includes("saida"))
      return { 
        color: "text-red-600", 
        bg: "bg-red-50", 
        border: "border-l-red-500", 
        sign: "-",
        icon: TrendingDown,
        gradient: "from-red-500 to-red-600"
      };

    if (t.includes("venda"))
      return { 
        color: "text-orange-600", 
        bg: "bg-orange-50", 
        border: "border-l-orange-500", 
        sign: "-",
        icon: ShoppingBag,
        gradient: "from-orange-500 to-amber-500"
      };

    if (t.includes("transfer"))
      return { 
        color: "text-blue-600", 
        bg: "bg-blue-50", 
        border: "border-l-blue-500", 
        sign: "↔",
        icon: Repeat,
        gradient: "from-blue-500 to-indigo-500"
      };

    return { 
      color: "text-gray-600", 
      bg: "bg-gray-50", 
      border: "border-l-gray-400", 
      sign: "",
      icon: Package,
      gradient: "from-gray-500 to-gray-600"
    };
  };

  const getBarColor = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes("entrada")) return "#16a34a";
    if (t.includes("saída") || t.includes("saida")) return "#dc2626";
    if (t.includes("venda")) return "#ea580c";
    if (t.includes("transfer")) return "#2563eb";
    return "#6b7280";
  };

  const filtered = useMemo(() => {
    const result = data.filter((m: any) => {
      return (
        m.productName?.toLowerCase().includes(search.toLowerCase()) &&
        (type ? m.movementType === type : true) &&
        (user ? m.responsibleUser?.toLowerCase().includes(user.toLowerCase()) : true) &&
        (date
          ? new Date(m.createdAt).toISOString().slice(0, 10) === date
          : true)
      );
    });
    return result;
  }, [data, search, type, user, date]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);

  // 📊 GRÁFICO POR TIPO
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
      { type: "Entrada", total: base.ENTRADA, color: "#16a34a" },
      { type: "Saída", total: Math.abs(base.SAIDA), color: "#dc2626" },
      { type: "Venda", total: Math.abs(base.VENDA), color: "#ea580c" },
      { type: "Transferência", total: base.TRANSFERENCIA, color: "#2563eb" },
    ].filter(item => item.total > 0);
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-7xl rounded-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        
        {/* HEADER com gradiente */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-primary to-secondary rounded-t-2xl px-6 py-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Movimentos de Stock</h2>
                <p className="text-white/80 text-sm">Histórico completo de movimentações</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* TABS */}
          <div className="flex gap-2 mb-6 border-b">
            <button
              onClick={() => setActiveTab("list")}
              className={`px-5 py-2.5 rounded-t-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                activeTab === "list"
                  ? "bg-gradient-to-r from-primary to-secondary text-white shadow-md"
                  : "text-gray-600 hover:text-primary hover:bg-gray-50"
              }`}
            >
              <Package className="w-4 h-4" />
              Lista de Movimentos
            </button>
            <button
              onClick={() => setActiveTab("charts")}
              className={`px-5 py-2.5 rounded-t-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                activeTab === "charts"
                  ? "bg-gradient-to-r from-primary to-secondary text-white shadow-md"
                  : "text-gray-600 hover:text-primary hover:bg-gray-50"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Análise Gráfica
            </button>
          </div>

          {/* FILTROS */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 p-5 rounded-xl mb-6 space-y-3">
            <div className="flex items-center gap-2 font-semibold text-gray-700">
              <Filter size={18} />
              <span>Filtros</span>
            </div>

            <div className="grid md:grid-cols-4 gap-3">
              <div className="relative">
                <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  placeholder="Buscar produto..."
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <select
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition bg-white"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="">Todos os tipos</option>
                {types.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>

              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  placeholder="Operador"
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                />
              </div>

              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>

            {(search || type || user || date) && (
              <button
                onClick={() => {
                  setSearch("");
                  setType("");
                  setUser("");
                  setDate("");
                  setCurrentPage(1);
                }}
                className="text-sm text-primary hover:text-primary/80 underline transition"
              >
                Limpar todos os filtros
              </button>
            )}
          </div>

          {/* GRÁFICOS */}
          {activeTab === "charts" && !loading && filtered.length > 0 && (
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* BAR CHART */}
              <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all">
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-gray-800">
                    Por tipo de movimentação
                  </h3>
                </div>

                {chartByType.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={chartByType}>
                      <XAxis dataKey="type" />
                      <Tooltip 
                        formatter={(value: any) => [`${value} unidades`, "Quantidade"]}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      />
                      <Bar dataKey="total" radius={[8, 8, 0, 0]}>
                        {chartByType.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[250px] text-gray-400">
                    <p>Sem dados para exibir</p>
                  </div>
                )}
              </div>

              {/* LINE CHART */}
              <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all">
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
                  <LineChartIcon className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-gray-800">
                    Evolução no tempo
                  </h3>
                </div>

                {chartByDate.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={chartByDate}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="date" />
                      <Tooltip 
                        formatter={(value: any) => [`${value} unidades`, "Saldo"]}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      />
                      <Line
                        type="monotone"
                        dataKey="total"
                        stroke="#16a34a"
                        strokeWidth={3}
                        dot={{ fill: '#16a34a', r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[250px] text-gray-400">
                    <p>Sem dados para exibir</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* LOADING */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <Package className="absolute inset-0 m-auto w-4 h-4 text-primary animate-pulse" />
              </div>
              <p className="mt-4 text-gray-500">Carregando movimentos...</p>
            </div>
          )}

          {/* EMPTY */}
          {!loading && filtered.length === 0 && (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                <Package className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">Nenhuma movimentação encontrada</p>
              <p className="text-sm text-gray-400 mt-1">Tente ajustar os filtros aplicados</p>
            </div>
          )}

          {/* LISTA PAGINADA */}
          {activeTab === "list" && !loading && filtered.length > 0 && (
            <>
              <div className="space-y-3 mb-6">
                {paginatedData.map((m: any, i: number) => {
                  const style = getTypeStyle(m.movementType);
                  const IconComponent = style.icon;

                  return (
                    <div
                      key={i}
                      className={`group relative p-4 rounded-xl shadow-sm border-l-4 ${style.border} bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 overflow-hidden`}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-r ${style.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                      
                      <div className="flex justify-between items-start">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <div className={`p-1.5 rounded-lg ${style.bg}`}>
                              <IconComponent className={`w-4 h-4 ${style.color}`} />
                            </div>
                            <p className="font-bold text-gray-800">
                              {m.productName}
                            </p>
                          </div>

                          <div className="flex items-center gap-3 flex-wrap">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${style.bg} ${style.color}`}>
                              {m.movementType}
                            </span>
                            
                            <div className="flex items-center gap-1.5 text-sm text-gray-500">
                              <User size={12} />
                              <span>{m.responsibleUser}</span>
                            </div>
                            
                            <div className="flex items-center gap-1.5 text-sm text-gray-500">
                              <Calendar size={12} />
                              <span>{new Date(m.createdAt).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <span className={`text-2xl font-bold ${style.color}`}>
                            {style.sign} {m.quantity}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between pt-2 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-gray-500">Tinha:</span>
                          <span className="font-medium text-red-500">{m.quantityBefore}</span>
                          <ArrowUpDown size={14} className="text-gray-400" />
                          <span className="text-gray-500">Restou:</span>
                          <span className="font-bold text-green-600">{m.quantityAfter}</span>
                        </div>
                        
                        {m.reason && (
                          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                            Motivo: {m.reason}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* PAGINAÇÃO */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6 pt-4 border-t">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      currentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white border border-gray-200 text-gray-700 hover:bg-primary hover:text-white hover:border-primary"
                    }`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`w-10 h-10 rounded-lg font-medium transition-all duration-300 ${
                              currentPage === page
                                ? "bg-gradient-to-r from-primary to-secondary text-white shadow-md scale-105"
                                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                            }`}
                          >
                            {page}
                          </button>
                        );
                      }
                      if (page === currentPage - 2 || page === currentPage + 2) {
                        return <span key={page} className="w-10 h-10 flex items-center justify-center text-gray-400">...</span>;
                      }
                      return null;
                    })}
                  </div>
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      currentPage === totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white border border-gray-200 text-gray-700 hover:bg-primary hover:text-white hover:border-primary"
                    }`}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
              
              {/* Info de registros */}
              <div className="text-center text-sm text-gray-400 mt-4">
                Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, filtered.length)} de {filtered.length} registros
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}