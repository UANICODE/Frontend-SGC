"use client";

import { useState } from "react";

interface Props {
  onFilter: (filters: {
    nome: string;
    email: string;
    ativo: string;
  }) => void;
}

export function UserFilters({ onFilter }: Props) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [ativo, setAtivo] = useState("");

  function applyFilter() {
    onFilter({ nome, email, ativo });
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow flex flex-col md:flex-row gap-4">

      <input
        placeholder="Nome do usuário"
        className="input flex-1"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />

      <input
        placeholder="Email"
        className="input flex-1"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <select
        className="input w-48"
        value={ativo}
        onChange={(e) => setAtivo(e.target.value)}
      >
        <option value="">Todos</option>
        <option value="true">Ativos</option>
        <option value="false">Inativos</option>
      </select>

      <button
        onClick={applyFilter}
        className="bg-primary text-white px-6 rounded-xl"
      >
        Filtrar
      </button>
    </div>
  );
}