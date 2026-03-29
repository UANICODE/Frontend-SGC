"use client";

import { useState, useEffect } from "react";
import { useSuperProduct } from "@/hooks/admin /useSuperProduct";
import { Search, X } from "lucide-react";

export function SuperProductSearch() {
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");

  const { data, loading } = useSuperProduct(query);

  // 🔥 AUTO SEARCH (debounce)
  useEffect(() => {
    const delay = setTimeout(() => {
      setQuery(search.trim());
    }, 300);

    return () => clearTimeout(delay);
  }, [search]);

  // 🔥 ENTER SEARCH (instantâneo)
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      setQuery(search.trim());
    }
  }

  // 🔥 LIMPAR CAMPO + RESULTADOS
  function handleClear() {
    setSearch("");
    setQuery("");
  }

  const shouldShowResults = query.length > 0;

  return (
    <div className="bg-white p-6 rounded-2xl shadow space-y-6">

      {/* HEADER */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800">
          Pesquisa Inteligente de Produtos
        </h2>
        <p className="text-sm text-gray-500">
          Consulte rapidamente os seus produtos globalmente
        </p>
      </div>

      {/* INPUT */}
      <div className="relative">

        <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Procurar produto global..."
          className="w-full pl-10 pr-10 py-3 border rounded-xl focus:ring-2 focus:ring-primary outline-none transition"
        />

        {/* BOTÃO LIMPAR */}
        {search && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-3.5 text-gray-400 hover:text-black transition"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* LOADING */}
      {loading && shouldShowResults && (
        <p className="text-sm text-gray-500">Buscando produtos...</p>
      )}

      {/* SEM RESULTADOS */}
      {shouldShowResults && !loading && data?.length === 0 && (
        <div className="text-center text-gray-500 py-10">
          Produto não encontrado
        </div>
      )}

      {/* RESULTADOS */}
      {shouldShowResults && data?.map((p: any, i: number) => (
        <div
          key={i}
          className="border rounded-xl p-4 hover:shadow-md transition bg-gray-50"
        >

          {/* HEADER */}
          <div className="flex items-center gap-4">
            <img
              src={p.imageUrl}
              className="w-14 h-14 rounded-xl object-cover"
            />

            <div>
              <h3 className="font-semibold text-gray-800">
                {p.productName}
              </h3>
              <p className="text-sm text-gray-500">{p.category}</p>
              <p className="text-green-600 font-bold">
                Stock Total: {p.totalStock}
              </p>
            </div>
          </div>

          {/* ESTABELECIMENTOS */}
          <div className="mt-4 space-y-2">
            {p.establishments.map((e: any, idx: number) => (
              <div
                key={idx}
                className="flex justify-between text-sm border-b pb-1 text-gray-600"
              >
                <span>{e.establishmentName}</span>
                <span>Stock: {e.stock}</span>
                <span>Preço: {e.price}</span>
                <span>
                  {e.lastEntry
                    ? new Date(e.lastEntry).toLocaleDateString()
                    : "-"}
                </span>
              </div>
            ))}
          </div>

        </div>
      ))}

    </div>
  );
}