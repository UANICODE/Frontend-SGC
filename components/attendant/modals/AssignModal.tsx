// components/attendant/modals/AssignModal.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowPathIcon, 
  TableCellsIcon, 
  UserGroupIcon, 
  XMarkIcon,
  CheckCircleIcon,
  SparklesIcon,
  ClockIcon
} from "@heroicons/react/24/outline";

interface AssignModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (tableId?: string, waiterId?: string) => void;
  tables: any[];
  waiters: any[];
  saleNumber?: string;
  initialTableId?: string;
  initialWaiterId?: string;
  primaryColor: string;
  secondaryColor: string;
}

export function AssignModal({ 
  open, 
  onClose, 
  onConfirm, 
  tables, 
  waiters, 
  saleNumber,
  initialTableId,
  initialWaiterId,
  primaryColor,
  secondaryColor
}: AssignModalProps) {
  const [selectedTableId, setSelectedTableId] = useState<string>("");
  const [selectedWaiterId, setSelectedWaiterId] = useState<string>("");
  const [saving, setSaving] = useState(false);

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

  const selectedTable = tables.find(t => t.id === selectedTableId);
  const selectedWaiter = waiters.find(w => w.id === selectedWaiterId);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop com blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg overflow-hidden"
          >
            {/* Card principal */}
            <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Barra de gradiente superior */}
              <div 
                className="absolute top-0 left-0 right-0 h-1"
                style={{ background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})` }}
              ></div>
              
              {/* Header */}
              <div className="px-6 py-5 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div 
                        className="p-1.5 rounded-lg"
                        style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
                      >
                        <SparklesIcon className="w-4 h-4 text-white" />
                      </div>
                      <h2 className="text-xl font-bold" style={{ color: primaryColor }}>
                        {initialTableId || initialWaiterId ? "Editar Atribuição" : "Atribuir Mesa e Garçom"}
                      </h2>
                    </div>
                  </div>
                  
                  <button
                    onClick={onClose}
                    className="p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 group"
                  >
                    <XMarkIcon className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </button>
                </div>
              </div>

              {/* Conteúdo do Modal */}
              <div className="p-6 space-y-6">
                {/* Informação da Venda */}
                {saleNumber && (
                  <div 
                    className="rounded-xl p-3 border"
                    style={{ 
                      background: `linear-gradient(135deg, ${primaryColor}10, ${secondaryColor}10)`,
                      borderColor: `${primaryColor}20`
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1" style={{ color: primaryColor }}>
                      <ClockIcon className="w-4 h-4" />
                      <span className="text-xs font-semibold uppercase tracking-wider">Venda em processo</span>
                    </div>
                    <p className="text-sm font-mono font-semibold" style={{ color: primaryColor }}>#{saleNumber}</p>
                  </div>
                )}

                {/* Seleção de Mesa */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <div 
                      className="p-1 rounded-lg"
                      style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
                    >
                      <TableCellsIcon className="w-3.5 h-3.5 text-white" />
                    </div>
                    Mesa (opcional)
                  </label>
                  <div className="relative group">
                    <select
                      value={selectedTableId}
                      onChange={(e) => setSelectedTableId(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none transition-all duration-200 appearance-none cursor-pointer hover:bg-gray-100"
                      style={{ 
                        borderColor: '#e5e7eb',
                      }}
                      onFocus={(e) => e.target.style.borderColor = primaryColor}
                      onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                    >
                      <option value="">Nenhuma mesa selecionada</option>
                      {tables.filter(t => t.active).map((table) => (
                        <option key={table.id} value={table.id}>
                          Mesa {table.number} {table.capacity ? `• ${table.capacity} pessoas` : ""}
                          {table.location ? ` • ${table.location}` : ""}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Preview da mesa selecionada */}
                  {selectedTableId && selectedTable && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 p-3 rounded-lg"
                      style={{ 
                        background: `linear-gradient(135deg, ${primaryColor}10, ${secondaryColor}10)`,
                        border: `1px solid ${primaryColor}30`
                      }}
                    >
                      <div className="flex items-center gap-2" style={{ color: primaryColor }}>
                        <CheckCircleIcon className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          Mesa {selectedTable.number} selecionada
                        </span>
                      </div>
                      {selectedTable.location && (
                        <p className="text-xs text-gray-500 mt-1 ml-6">
                          Localização: {selectedTable.location}
                        </p>
                      )}
                      {selectedTable.capacity && (
                        <p className="text-xs text-gray-500 mt-1 ml-6">
                          Capacidade: {selectedTable.capacity} pessoas
                        </p>
                      )}
                    </motion.div>
                  )}
                </div>

                {/* Seleção de Garçom */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <div 
                      className="p-1 rounded-lg"
                      style={{ background: `linear-gradient(135deg, ${secondaryColor}, ${primaryColor})` }}
                    >
                      <UserGroupIcon className="w-3.5 h-3.5 text-white" />
                    </div>
                    Garçom (opcional)
                  </label>
                  <div className="relative group">
                    <select
                      value={selectedWaiterId}
                      onChange={(e) => setSelectedWaiterId(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none transition-all duration-200 appearance-none cursor-pointer hover:bg-gray-100"
                      style={{ 
                        borderColor: '#e5e7eb',
                      }}
                      onFocus={(e) => e.target.style.borderColor = secondaryColor}
                      onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                    >
                      <option value="">Nenhum garçom selecionado</option>
                      {waiters.filter(w => w.active).map((waiter) => (
                        <option key={waiter.id} value={waiter.id}>
                          {waiter.name} {waiter.phone ? `• ${waiter.phone}` : ""}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  
                  
                </div>
              </div>

              {/* Footer com botões */}
              <div className="bg-gray-50 px-6 py-4 flex gap-3 border-t border-gray-100">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  disabled={saving}
                  className="flex-1 px-4 py-2.5 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100"
                >
                  Cancelar
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleConfirm}
                  disabled={saving}
                  className="flex-1 px-4 py-2.5 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100 relative overflow-hidden group"
                  style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
                >
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: `linear-gradient(135deg, ${secondaryColor}, ${primaryColor})` }}
                  ></div>
                  <span className="relative flex items-center justify-center gap-2">
                    {saving ? (
                      <>
                        <ArrowPathIcon className="w-4 h-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <CheckCircleIcon className="w-4 h-4" />
                        Salvar Atribuição
                      </>
                    )}
                  </span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}