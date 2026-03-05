"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useSale } from "@/hooks/attendant/useSale";
import { usePaymentMethods } from "@/hooks/attendant/usePaymentMethods";
import { ProductItem } from "@/types/attendant/sale/Product";
import { listProducts } from "@/service/attendant/product";
import { Receipt } from "@/types/attendant/sale/Receipt";
import { PaymentModal } from "@/components/attendant/modals/PaymentModal";
import { ReceiptPreview } from "@/components/attendant/ReceiptPreview";


export default function SalesPage() {
  const search = useSearchParams();

  const saleId = search.get("saleId");
const cashRegisterId = search.get("cashRegisterId");
const establishmentId = search.get("establishmentId");

  if (!cashRegisterId || !establishmentId ){
    return <div>Parâmetros inválidos.</div>;
  }

  const {
    sale,
    loading,
    startSale,
    handleAdd,
    handleRemove,
    handleQuantity,
    handleArchive,
    handleFinalize,
  } = useSale(establishmentId);

  const { methods } = usePaymentMethods();

  const [products, setProducts] = useState<ProductItem[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [searchName, setSearchName] = useState("");

  const [showPayment, setShowPayment] = useState(false);
  const [receipt, setReceipt] = useState<Receipt | null>(null);

  // Iniciar venda
useEffect(() => {
  if (saleId) {
    startSale(saleId);
  }
}, [saleId, startSale]);
  // Buscar produtos
  const loadProducts = useCallback(async () => {
    setProductsLoading(true);

    const list = await listProducts({
      establishmentId,
      name: searchName || undefined,
    });

    setProducts(list || []);
    setProductsLoading(false);
  }, [searchName, establishmentId]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Confirmar pagamento
async function handleConfirmPayment(methodId: string) {
  try {
    const receiptData = await handleFinalize(methodId);

    setShowPayment(false);
    setReceipt(receiptData);
  } catch (e: any) {
    alert(e.message);
  }
}

  if (!sale) return <div>Processando venda...</div>;

  return (
    <div className="flex gap-8 p-6">

      {/* ================= PRODUTOS ================= */}
      <div className="flex-1 space-y-4">

        <input
          placeholder="Buscar produto..."
          className="w-full p-3 border rounded-xl"
          onChange={(e) => setSearchName(e.target.value)}
        />

        {productsLoading && (
          <p className="text-sm text-gray-400">
            Carregando produtos...
          </p>
        )}

        <div className="grid grid-cols-2 gap-4">
          {products.map((p) => (
            <div
              key={p.id}
              className="bg-white p-4 rounded-xl shadow hover:shadow-md transition"
            >
              <h3 className="font-medium">{p.name}</h3>
              <p className="text-sm text-gray-500">
                € {p.price}
              </p>

              <button
                onClick={() => handleAdd(p.id)}
                className="mt-2 w-full bg-black text-white py-2 rounded-lg"
              >
                Adicionar
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ================= VENDA ================= */}
      <div className="w-96 bg-white p-6 rounded-2xl shadow space-y-4">

        {sale.items.length === 0 && (
          <p className="text-gray-400 text-center">
            Nenhum item adicionado
          </p>
        )}

        {sale.items.map((item) => (
          <div
            key={item.itemId}
            className="border-b pb-3"
          >
            <div className="flex justify-between font-medium">
              <span>{item.productName}</span>
              <span>€ {item.subtotal}</span>
            </div>

            <div className="flex items-center gap-2 mt-2">

              <button
                onClick={() =>
                  item.quantity > 1 &&
                  handleQuantity(
                    item.itemId,
                    item.quantity - 1
                  )
                }
                className="px-2 border rounded"
              >
                -
              </button>

              <span>{item.quantity}</span>

              <button
                onClick={() =>
                  handleQuantity(
                    item.itemId,
                    item.quantity + 1
                  )
                }
                className="px-2 border rounded"
              >
                +
              </button>

              <button
                onClick={() =>
                  handleRemove(item.itemId)
                }
                className="ml-auto text-red-500 text-sm"
              >
                Remover
              </button>
            </div>
          </div>
        ))}

        {/* TOTAIS */}
        <div className="border-t pt-4 space-y-1 text-sm">
          <p>Subtotal: € {sale.subtotal}</p>
          <p>Desconto: € {sale.discount}</p>
          <p className="font-bold text-lg">
            Total: € {sale.total}
          </p>
        </div>

        {/* AÇÕES */}
        <div className="space-y-2 pt-2">

          <button
            onClick={handleArchive}
            className="w-full border py-2 rounded-xl"
          >
            Arquivar
          </button>

          <button
            disabled={sale.items.length === 0}
            onClick={() => setShowPayment(true)}
            className="w-full bg-green-600 text-white py-3 rounded-xl disabled:opacity-50"
          >
            Finalizar Venda
          </button>
        </div>

        {loading && (
          <div className="text-center text-sm text-gray-400">
            Processando...
          </div>
        )}
      </div>

      {/* ================= MODAIS ================= */}

      <PaymentModal
        open={showPayment}
        methods={methods}
        onClose={() => setShowPayment(false)}
        onConfirm={handleConfirmPayment}
      />

      {receipt && (
        <ReceiptPreview
          receipt={receipt}
          onClose={() => setReceipt(null)}
          onPrint={() => window.print()}
        />
      )}
    </div>
  );
}