// components/admin/modals/CashRegisterExpensesModal.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { X, DollarSign, Calendar, User, AlertCircle } from "lucide-react";
import { useCashRegisterExpensesAdmin } from "@/hooks/admin/cash-register/useCashRegisterExpensesAdmin";

interface Props {
  open: boolean;
  cashRegisterId: string;
  onClose: () => void;
}

export function CashRegisterExpensesModal({ open, cashRegisterId, onClose }: Props) {
  const { data: expenses, loading, fetch, reset } = useCashRegisterExpensesAdmin();
  const [hasFetched, setHasFetched] = useState(false);
  const previousIdRef = useRef<string | null>(null);

  // 🔥 Controlar fetch apenas quando necessário
  useEffect(() => {
    if (open && cashRegisterId) {
      // Se o ID mudou, resetar e buscar
      if (previousIdRef.current !== cashRegisterId) {
        setHasFetched(false);
        previousIdRef.current = cashRegisterId;
      }
      
      if (!hasFetched) {
        console.log("🚀 Buscando despesas para:", cashRegisterId);
        fetch(cashRegisterId);
        setHasFetched(true);
      }
    }
    
    // Resetar quando fechar
    if (!open) {
      setHasFetched(false);
      previousIdRef.current = null;
      reset();
    }
  }, [open, cashRegisterId, fetch, reset, hasFetched]);

  const formatCurrency = (value: number) => {
    return value.toFixed(2) + " MT";
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString("pt-MZ", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!open) return null;

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl max-h-[90vh] flex flex-col">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-5 flex-shrink-0 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Despesas do Caixa</h2>
                <p className="text-white/80 text-sm">
                  {expenses.length} registro(s) de despesas
                </p>
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

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Total */}
          {!loading && expenses.length > 0 && (
            <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-700">Total de Despesas:</span>
                <span className="text-2xl font-bold text-orange-600">
                  {formatCurrency(totalExpenses)}
                </span>
              </div>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-primary/60 animate-pulse" />
                </div>
              </div>
              <p className="mt-4 text-gray-500 font-medium">Carregando despesas...</p>
            </div>
          )}

          {/* Empty */}
          {!loading && expenses.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                <DollarSign className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">Nenhuma despesa registrada</p>
              <p className="text-sm text-gray-400 mt-1">Este caixa não tem despesas</p>
            </div>
          )}

          {/* Lista */}
          {!loading && expenses.length > 0 && (
            <div className="space-y-3">
              {expenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-orange-200 transition-all"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-gray-800">
                        {expense.description}
                      </span>
                      <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded-full">
                        {expense.categoryName}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(expense.expenseDate)}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {expense.registeredByName}
                      </span>
                      {expense.notes && (
                        <span className="flex items-center gap-1 text-amber-600">
                          <AlertCircle className="w-3 h-3" />
                          {expense.notes}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-lg font-bold text-orange-600">
                    {formatCurrency(expense.amount)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="flex gap-3 p-6 bg-gray-50 border-t flex-shrink-0 rounded-b-2xl">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-100 transition-all"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}