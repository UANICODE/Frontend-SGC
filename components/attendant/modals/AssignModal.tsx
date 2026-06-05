// components/attendant/modals/AssignModal.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowPathIcon, TableCellsIcon, UserGroupIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface AssignModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (tableId?: string, waiterId?: string) => void;
  tables: any[];
  waiters: any[];
  saleNumber?: string;
  initialTableId?: string;  // 🆕
  initialWaiterId?: string; // 🆕
}

export function AssignModal({ 
  open, 
  onClose, 
  onConfirm, 
  tables, 
  waiters, 
  saleNumber,
  initialTableId,
  initialWaiterId
}: AssignModalProps) {
  const [selectedTableId, setSelectedTableId] = useState<string>("");
  const [selectedWaiterId, setSelectedWaiterId] = useState<string>("");
  const [saving, setSaving] = useState(false);

  // Carregar valores iniciais quando o modal abre
  useEffect(() => {
    if (open) {
      setSelectedTableId(initialTableId || "");
      setSelectedWaiterId(initialWaiterId || "");
    }
  }, [open, initialTableId, initialWaiterId]);

  if (!open) return null;

  const handleConfirm = async () => {
    setSaving(true);
    await onConfirm(selectedTableId || undefined, selectedWaiterId || undefined);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl p-6 w-full max-w-md"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {initialTableId || initialWaiterId ? "Editar Atribuição" : "Atribuir Mesa e Garçom"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {saleNumber && (
          <p className="text-sm text-gray-500 mb-4">Venda: #{saleNumber}</p>
        )}

        <div className="space-y-4">
          {/* Mesa */}
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <TableCellsIcon className="w-4 h-4" />
              Mesa (opcional)
            </label>
            <select
              value={selectedTableId}
              onChange={(e) => setSelectedTableId(e.target.value)}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-primary focus:outline-none"
            >
              <option value="">Nenhuma</option>
              {tables.filter(t => t.active).map((table) => (
                <option key={table.id} value={table.id}>
                  Mesa {table.number} {table.capacity ? `- ${table.capacity} pessoas` : ""}
                  {table.location ? ` (${table.location})` : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Garçom */}
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <UserGroupIcon className="w-4 h-4" />
              Garçom (opcional)
            </label>
            <select
              value={selectedWaiterId}
              onChange={(e) => setSelectedWaiterId(e.target.value)}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-primary focus:outline-none"
            >
              <option value="">Nenhum</option>
              {waiters.filter(w => w.active).map((waiter) => (
                <option key={waiter.id} value={waiter.id}>
                  {waiter.name} {waiter.phone ? `- ${waiter.phone}` : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-3 pt-6">
          <button 
            onClick={onClose} 
            disabled={saving}
            className="flex-1 border rounded-lg py-2 hover:bg-gray-50 transition disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={saving}
            className="flex-1 bg-primary text-white rounded-lg py-2 hover:brightness-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <ArrowPathIcon className="w-4 h-4 animate-spin" />
                Salvando...
              </>
            ) : (
              "Salvar"
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}