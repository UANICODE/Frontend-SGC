"use client";

import { useMemo, useState } from "react";
import { CashRegisterSale } from "@/types/admin/cash-register";
import {
  X,
  ChevronDown,
  ShoppingCart,
  Calendar,
  CreditCard,
  Filter,
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
  open: boolean;
  onClose: () => void;
  sales: CashRegisterSale[];
  loading: boolean;
}

export function CashRegisterSalesModal({
  open,
  onClose,
  sales,
  loading,
}: Props) {
  const [openSale, setOpenSale] = useState<number | null>(null);

  // filtros
  const [method, setMethod] = useState("");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [date, setDate] = useState("");

  const [searchItems, setSearchItems] = useState<Record<number, string>>({});

  // 🔍 FILTROS
  const filteredSales = useMemo(() => {
    return sales.filter((s) => {
      const matchMethod = method ? s.paymentMethod === method : true;
      const matchMin = min ? s.total >= Number(min) : true;
      const matchMax = max ? s.total <= Number(max) : true;
      const matchDate = date
        ? new Date(s.createdAt).toISOString().slice(0, 10) === date
        : true;

      return matchMethod && matchMin && matchMax && matchDate;
    });
  }, [sales, method, min, max, date]);

  // 📊 GRÁFICO
  const chartData = useMemo(() => {
    const map: Record<string, number> = {};

    filteredSales.forEach((s) => {
      map[s.paymentMethod] =
        (map[s.paymentMethod] || 0) + s.total;
    });

    return Object.keys(map).map((key) => ({
      method: key,
      total: map[key],
    }));
  }, [filteredSales]);

  const methods = [...new Set(sales.map((s) => s.paymentMethod))];

  const hasFilters = method || min || max || date;

  const clearFilters = () => {
    setMethod("");
    setMin("");
    setMax("");
    setDate("");
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-7xl rounded-2xl p-6 max-h-[90vh] overflow-y-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <ShoppingCart /> Vendas da Caixa
          </h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* TOTAL */}
        <div className="mb-4 text-sm text-gray-600">
          Total de vendas:{" "}
          <span className="font-bold text-primary">
            {filteredSales.length}
          </span>
        </div>

        {/* 🔍 FILTROS */}
        <div className="bg-gray-50 p-4 rounded-xl mb-6 space-y-4">

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 font-semibold">
              <Filter size={16} /> Filtros
            </div>

            <button
              onClick={clearFilters}
              className="text-sm text-red-500 hover:underline"
            >
              Limpar filtros
            </button>
          </div>

          {hasFilters && (
            <p className="text-xs text-gray-400">
              Filtros ativos
            </p>
          )}

          <div className="grid md:grid-cols-4 gap-3">

            <select
              className="border p-2 rounded-lg"
              value={method}
              onChange={(e) => setMethod(e.target.value)}
            >
              <option value="">Método</option>
              {methods.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>

            <input
              placeholder="Preço mínimo"
              className="border p-2 rounded-lg"
              value={min}
              onChange={(e) => setMin(e.target.value)}
            />

            <input
              placeholder="Preço máximo"
              className="border p-2 rounded-lg"
              value={max}
              onChange={(e) => setMax(e.target.value)}
            />

            <input
              type="date"
              className="border p-2 rounded-lg"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        {/* 📊 GRÁFICO */}
        {!loading && filteredSales.length > 0 && (
          <div className="bg-white p-4 rounded-xl shadow mb-6">
            <h3 className="font-semibold mb-3">
              Total por método de pagamento
            </h3>

            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <XAxis dataKey="method" />
                <Tooltip />
                <Bar dataKey="total" fill="#16a34a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
          </div>
        )}

        {/* ❌ SEM RESULTADO */}
        {!loading && filteredSales.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            <p className="text-lg font-medium">
              Nenhum resultado encontrado
            </p>
            <p className="text-sm">
              Tente ajustar os filtros aplicados
            </p>
          </div>
        )}

        {/* LISTA */}
        <div className="space-y-4">
          {filteredSales.map((sale, index) => {
            const search = searchItems[sale.saleNumber] || "";

            const items = sale.items.filter((i) =>
              i.productName
                .toLowerCase()
                .includes(search.toLowerCase())
            );

            return (
              <div key={sale.saleNumber} className="border rounded-xl p-4">

                {/* HEADER */}
                <div
                  className="flex justify-between cursor-pointer"
                  onClick={() =>
                    setOpenSale(
                      openSale === sale.saleNumber
                        ? null
                        : sale.saleNumber
                    )
                  }
                >
                  <div>
                    <p className="font-bold">
                      Venda #{index + 1}
                    </p>

                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      <CreditCard size={14} />
                      {sale.paymentMethod}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-bold text-green-600">
                      {sale.total.toLocaleString("MZ", {
                        style: "currency",
                        currency: "MZN",
                      })}
                    </span>

                    <ChevronDown
                      className={`transition ${
                        openSale === sale.saleNumber
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </div>
                </div>

                {/* DATA */}
                <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                  <Calendar size={14} />
                  {new Date(sale.createdAt).toLocaleString()}
                </div>

                {/* EXPAND */}
                {openSale === sale.saleNumber && (
                  <div className="mt-4 space-y-3">

                    <input
                      placeholder="Buscar produto..."
                      className="border p-2 rounded-lg w-full"
                      value={search}
                      onChange={(e) =>
                        setSearchItems({
                          ...searchItems,
                          [sale.saleNumber]: e.target.value,
                        })
                      }
                    />

                    {items.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg"
                      >
                        <img
                          src={item.imageUrl || "/placeholder.png"}
                          className="w-16 h-16 rounded-lg object-cover"
                        />

                        <div className="flex-1">
                          <p className="font-medium">
                            {item.productName}
                          </p>

                          <p className="text-sm text-gray-500">
                            {item.quantity} x{" "}
                            {item.unitPrice.toLocaleString("MZ", {
                              style: "currency",
                              currency: "MZN",
                            })}
                          </p>
                        </div>

                        <span className="font-bold">
                          {item.subtotal.toLocaleString("MZ", {
                            style: "currency",
                            currency: "MZN",
                          })}
                        </span>
                      </div>
                    ))}

                    {items.length === 0 && (
                      <p className="text-sm text-gray-400">
                        Nenhum produto encontrado
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}