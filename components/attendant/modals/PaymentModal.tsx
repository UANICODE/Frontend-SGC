// components/attendant/modals/PaymentModal.tsx
"use client";

import { PaymentMethod } from "@/types/attendant/sale/PaymentMethod";
import { useState, useEffect } from "react";
import { CheckCircleIcon, PlusIcon, TrashIcon, CreditCardIcon, BanknotesIcon } from "@heroicons/react/24/outline";

interface PaymentSplit {
  methodId: string;
  methodName: string;
  amount: number;
}

interface Props {
  open: boolean;
  methods: PaymentMethod[];
  totalAmount: number;
  onClose: () => void;
  onConfirm: (payments: { methodId: string; amount: number }[]) => void;
}

type PaymentType = "single" | "multiple";

export function PaymentModal({
  open,
  methods,
  totalAmount,
  onClose,
  onConfirm,
}: Props) {
  const [paymentType, setPaymentType] = useState<PaymentType>("single");
  const [selectedMethodId, setSelectedMethodId] = useState("");
  const [payments, setPayments] = useState<PaymentSplit[]>([]);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Calcular quanto já foi pago e quanto falta
  const paidAmount = payments.reduce((sum, p) => sum + p.amount, 0);
  const remainingAmount = totalAmount - paidAmount;
  const isComplete = Math.abs(remainingAmount) < 0.01;

  // Resetar ao abrir modal
  useEffect(() => {
    if (open) {
      setPaymentType("single");
      setSelectedMethodId("");
      setPayments([]);
      setPaymentAmount("");
      setError("");
    }
  }, [open]);

  if (!open) return null;

  // ================= PAGAMENTO ÚNICO =================
  const handleSinglePaymentConfirm = async () => {
    if (!selectedMethodId) {
      setError("Selecione um método de pagamento");
      return;
    }
    
    setLoading(true);
    await onConfirm([{ methodId: selectedMethodId, amount: totalAmount }]);
    setLoading(false);
  };

  // ================= ADICIONAR PAGAMENTO MÚLTIPLO =================
  const handleAddPayment = () => {
    // Validar método selecionado
    if (!selectedMethodId) {
      setError("Selecione um método de pagamento");
      return;
    }
    
    // Validar valor
    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      setError("Digite um valor válido maior que zero");
      return;
    }
    
    // Validar se o valor não excede o restante
    if (amount > remainingAmount + 0.01) {
      setError(`Valor excede o restante a pagar: ${remainingAmount.toFixed(2)} MZN`);
      return;
    }
    
    // Verificar se já existe pagamento com este método
    const existingPaymentIndex = payments.findIndex(p => p.methodId === selectedMethodId);
    
    if (existingPaymentIndex >= 0) {
      // Se já existe, atualiza o valor (soma)
      const updatedPayments = [...payments];
      const newAmount = updatedPayments[existingPaymentIndex].amount + amount;
      
      if (newAmount > totalAmount) {
        setError(`Valor total excede o valor da venda`);
        return;
      }
      
      updatedPayments[existingPaymentIndex] = {
        ...updatedPayments[existingPaymentIndex],
        amount: newAmount
      };
      setPayments(updatedPayments);
    } else {
      // Se não existe, adiciona novo
      const method = methods.find(m => m.id === selectedMethodId);
      if (!method) return;
      
      setPayments([...payments, {
        methodId: selectedMethodId,
        methodName: method.name,
        amount: amount
      }]);
    }
    
    // Limpar campos
    setSelectedMethodId("");
    setPaymentAmount("");
    setError("");
  };

  // ================= REMOVER PAGAMENTO =================
  const handleRemovePayment = (index: number) => {
    setPayments(payments.filter((_, i) => i !== index));
    setError("");
  };

  // ================= EDITAR VALOR DE UM PAGAMENTO =================
  const handleEditPayment = (index: number, newAmount: number) => {
    if (isNaN(newAmount) || newAmount < 0) return;
    
    const updatedPayments = [...payments];
    updatedPayments[index].amount = newAmount;
    setPayments(updatedPayments);
  };

  // ================= FINALIZAR MÚLTIPLOS PAGAMENTOS =================
  const handleMultiplePaymentsConfirm = async () => {
    // Validar se completou o valor
    if (!isComplete) {
      setError(`Falta pagar: ${remainingAmount.toFixed(2)} MZN`);
      return;
    }
    
    // Validar se há pelo menos um pagamento
    if (payments.length === 0) {
      setError("Adicione pelo menos um pagamento");
      return;
    }
    
    // Validar se todos os valores são positivos
    for (const p of payments) {
      if (p.amount <= 0) {
        setError(`Valor inválido para ${p.methodName}`);
        return;
      }
    }
    
    setLoading(true);
    await onConfirm(payments.map(p => ({ methodId: p.methodId, amount: p.amount })));
    setLoading(false);
  };

  // Opções rápidas de valor (para facilitar)
  const quickAmounts = [50, 100, 200, 500, 1000];

  const handleQuickAmount = (amount: number) => {
    if (amount <= remainingAmount) {
      setPaymentAmount(amount.toString());
    } else {
      setError(`Valor máximo permitido: ${remainingAmount.toFixed(2)} MZN`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold text-primary">Finalizar Venda</h2>
        
        {/* ================= TIPO DE PAGAMENTO ================= */}
        <div className="flex gap-4 border-b pb-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={paymentType === "single"}
              onChange={() => {
                setPaymentType("single");
                setError("");
                setPayments([]);
              }}
              className="w-4 h-4 accent-primary"
            />
            <span className="flex items-center gap-1">
              <CreditCardIcon className="w-4 h-4" />
              Pagamento Único
            </span>
          </label>
          
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={paymentType === "multiple"}
              onChange={() => {
                setPaymentType("multiple");
                setError("");
                setSelectedMethodId("");
                setPaymentAmount("");
                setPayments([]);
              }}
              className="w-4 h-4 accent-primary"
            />
            <span className="flex items-center gap-1">
              <BanknotesIcon className="w-4 h-4" />
              Múltiplos Pagamentos
            </span>
          </label>
        </div>

        {/* ================= PAGAMENTO ÚNICO ================= */}
        {paymentType === "single" && (
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600">Valor Total</p>
              <p className="text-2xl font-bold text-green-600">MZN {totalAmount.toFixed(2)}</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Método de Pagamento *
              </label>
              <select
                value={selectedMethodId}
                onChange={(e) => setSelectedMethodId(e.target.value)}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              >
                <option value="">Selecione o método</option>
                {methods.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>

            {error && <p className="text-red-500 text-sm bg-red-50 p-2 rounded">{error}</p>}

            <div className="flex gap-3 pt-2">
              <button onClick={onClose} className="flex-1 border rounded-lg py-2 hover:bg-gray-50 transition">
                Cancelar
              </button>
              <button
                disabled={!selectedMethodId || loading}
                onClick={handleSinglePaymentConfirm}
                className="flex-1 bg-green-600 text-white rounded-lg py-2 disabled:opacity-50 hover:bg-green-700 transition flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
                ) : (
                  <CheckCircleIcon className="w-5 h-5" />
                )}
                {loading ? "Finalizando..." : "Concluir"}
              </button>
            </div>
          </div>
        )}

        {/* ================= PAGAMENTO MÚLTIPLO ================= */}
        {paymentType === "multiple" && (
          <div className="space-y-4">
            {/* Resumo de valores */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Total da venda:</span>
                <span className="font-bold">MZN {totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Pago:</span>
                <span className="font-bold text-green-600">MZN {paidAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Restante:</span>
                <span className={remainingAmount > 0 ? "text-red-500" : "text-green-500"}>
                  MZN {remainingAmount.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Lista de pagamentos adicionados */}
            {payments.length > 0 && (
              <div className="border rounded-lg p-3 space-y-2 max-h-48 overflow-y-auto">
                <h3 className="text-sm font-semibold text-gray-700">Pagamentos:</h3>
                {payments.map((p, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm font-medium">{p.methodName}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">MZN</span>
                      <input
                        type="number"
                        step="0.01"
                        value={p.amount}
                        onChange={(e) => handleEditPayment(idx, parseFloat(e.target.value) || 0)}
                        className="w-24 border rounded p-1 text-right text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                      />
                      <button
                        onClick={() => handleRemovePayment(idx)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Adicionar novo pagamento */}
            {remainingAmount > 0 && (
              <div className="space-y-3 border-t pt-3">
                <h3 className="text-sm font-semibold text-gray-700">Adicionar Pagamento:</h3>
                
                <select
                  value={selectedMethodId}
                  onChange={(e) => setSelectedMethodId(e.target.value)}
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                >
                  <option value="">Selecione o método de pagamento</option>
                  {methods.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Valor (MZN)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    placeholder="Digite o valor"
                    className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>

                {/* Valores rápidos */}
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs text-gray-500">Rápidos:</span>
                  {quickAmounts.map(amount => (
                    <button
                      key={amount}
                      onClick={() => handleQuickAmount(amount)}
                      className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition"
                    >
                      {amount}
                    </button>
                  ))}
                  <button
                    onClick={() => handleQuickAmount(remainingAmount)}
                    className="text-xs bg-primary/10 text-primary hover:bg-primary/20 px-2 py-1 rounded transition"
                  >
                    Restante ({remainingAmount.toFixed(0)})
                  </button>
                </div>
                
                <button
                  onClick={handleAddPayment}
                  disabled={!selectedMethodId || !paymentAmount}
                  className="w-full bg-black text-white py-2 rounded-lg disabled:opacity-50 hover:brightness-90 transition flex items-center justify-center gap-2"
                >
                  <PlusIcon className="w-5 h-5" />
                  Adicionar Pagamento
                </button>
              </div>
            )}

            {error && <p className="text-red-500 text-sm bg-red-50 p-2 rounded">{error}</p>}

            {/* Botões de ação */}
            <div className="flex gap-3 pt-2">
              <button onClick={onClose} className="flex-1 border rounded-lg py-2 hover:bg-gray-50 transition">
                Cancelar
              </button>
              <button
                disabled={payments.length === 0 || !isComplete || loading}
                onClick={handleMultiplePaymentsConfirm}
                className="flex-1 bg-green-600 text-white rounded-lg py-2 disabled:opacity-50 hover:bg-green-700 transition flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
                ) : (
                  <CheckCircleIcon className="w-5 h-5" />
                )}
                {loading ? "Finalizando..." : `Finalizar (${paidAmount.toFixed(2)} / ${totalAmount.toFixed(2)})`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}