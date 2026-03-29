"use client";

import { useEffect, useState } from "react";
import { useUserEstablishments } from "@/hooks/admin /useUserEstablishments";
import { useTransferStock } from "@/hooks/admin /useTransferStock";

export function TransferStockModal({
  open,
  onClose,
  product,
  currentEstablishmentId,
  onSuccess,
}: any) {
  const [quantity, setQuantity] = useState("");
  const [to, setTo] = useState("");

  // 🔥 NOVO
  const [message, setMessage] = useState("");
  const [type, setType] = useState<"success" | "error" | "">("");

  const { data, fetchAll } = useUserEstablishments();
  const { execute, loading } = useTransferStock();

  useEffect(() => {
    if (open) {
      fetchAll();
      setMessage(""); // limpa ao abrir
      setType("");
    }
  }, [open]);

  if (!open) return null;

  const options =
    data?.filter((e: any) => e.id !== currentEstablishmentId) || [];

  const canTransfer = options.length > 0;

  async function handle() {
    setMessage("");

    if (!to) {
      setType("error");
      return setMessage("Selecione o estabelecimento destino");
    }

    if (!quantity || Number(quantity) <= 0) {
      setType("error");
      return setMessage("Quantidade inválida");
    }

    const result = await execute({
      fromEstablishmentId: currentEstablishmentId,
      toEstablishmentId: to,
      productId: product.productId,
      quantity: Number(quantity),
    });

    if (result.success) {
      setType("success");
      setMessage(result.message);

      onSuccess();

      // opcional: fechar automático
      setTimeout(() => {
        onClose();
        setQuantity("");
        setTo("");
        setMessage("");
      }, 1200);
    } else {
      setType("error");
      setMessage(result.message);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-[400px] space-y-4">

        <h2 className="text-xl font-bold">
          Transferir {product.productName}
        </h2>

        {/* DESTINO */}
        <select
          className="input w-full"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        >
          <option value="">Selecionar destino</option>

          {options.map((e: any) => (
            <option key={e.id} value={e.id}>
              {e.name}
            </option>
          ))}
        </select>

        {!canTransfer && (
          <p className="text-sm text-red-500">
            Precisa de mais de um estabelecimento
          </p>
        )}

        {/* QUANTIDADE */}
        <input
          type="number"
          className="input w-full"
          placeholder="Quantidade"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />

        {/* 🔥 MENSAGEM */}
        {message && (
          <div
            className={`text-sm p-2 rounded ${
              type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        {/* BOTÃO */}
        <button
          onClick={handle}
          disabled={!canTransfer || loading}
          className={`w-full py-2 rounded text-white ${
            canTransfer
              ? "bg-green-600 hover:bg-green-500"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {loading ? "Transferindo..." : "Transferir"}
        </button>

        <button
          onClick={onClose}
          className="w-full text-sm text-gray-500 underline"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}