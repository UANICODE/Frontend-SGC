"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useSale } from "@/hooks/attendant/useSale";
import { usePaymentMethods } from "@/hooks/attendant/usePaymentMethods";
import { ProductItem } from "@/types/attendant/sale/Product";
import { listProducts } from "@/service/attendant/product";
import { Receipt } from "@/types/attendant/sale/Receipt";
import { PaymentModal } from "@/components/attendant/modals/PaymentModal";
import { ReceiptPreview } from "@/components/attendant/ReceiptPreview";
import { useToast } from "@/ context/ToastContext";
import { UserRole } from "@/enum/enum";
import { useRoleGuard } from "@/hooks/auth/useRoleGuard";

import { PlusIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { Minus, Plus, ShoppingCart } from "lucide-react";

export default function SalesPage() {
  useRoleGuard([UserRole.ATENDENTE]);

  const params = useParams<{ establishmentId: string }>();
  const search = useSearchParams();
  const router = useRouter();
  const toast = useToast();

  const establishmentId = params.establishmentId;
  const saleId = search.get("saleId");
  const cashRegisterId = search.get("cashRegisterId");

  const {
    sale,
    addingProductIds,
    processingItemIds,
    startSale,
    refreshSale,
    handleAdd,
    handleRemove,
    handleQuantity,
    handleArchive,
    handleFinalize,
  } = useSale(establishmentId);

  const { methods } = usePaymentMethods();

  // 🔥 ESTADOS
  const [allProducts, setAllProducts] = useState<ProductItem[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  const [receipt, setReceipt] = useState<Receipt | null>(null);

  // ================= INIT =================
  useEffect(() => {
    async function initSale() {
      if (sale) return;
      if (saleId) await refreshSale(saleId);
      else if (cashRegisterId) await startSale(cashRegisterId);
    }
    initSale();
  }, [saleId, cashRegisterId]);

  // ================= PRODUTOS (1x API) =================
  const loadProducts = useCallback(async () => {
    setProductsLoading(true);

    try {
      const list = await listProducts({
        establishmentId,
      });

      setAllProducts(list || []);
    } catch (e) {
      toast.showToast("Erro ao carregar produtos", "error");
    } finally {
      setProductsLoading(false);
    }
  }, [establishmentId]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // ================= FILTRO FRONTEND =================
  const filteredProducts = useMemo(() => {
    if (!searchName) return allProducts;

    return allProducts.filter((p) =>
      p.name.toLowerCase().includes(searchName.toLowerCase())
    );
  }, [allProducts, searchName]);

  // ================= PAGAMENTO =================
  async function handleConfirmPayment(methodId: string) {
    if (!sale) return;

    try {
      setFinalizing(true);
      const receiptData = await handleFinalize(methodId);
      setReceipt(receiptData);
      setShowPayment(false);
    } catch (e: any) {
      toast.showToast(e.message || "Erro ao finalizar venda", "error");
    } finally {
      setFinalizing(false);
    }
  }

  async function handleArchiveAndRedirect() {
    if (!sale) return;

    try {
      await handleArchive();
      router.push(`/attendant/dashboard/${establishmentId}/archived-sales`);
    } catch (e: any) {
      toast.showToast(e.message || "Erro ao arquivar venda", "error");
    }
  }

  if (!sale && !receipt) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <span className="animate-spin border-4 border-gray-300 border-t-transparent rounded-full w-12 h-12"></span>
        <span className="text-gray-500">Processando venda...</span>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col lg:flex-row gap-4 p-3 md:p-4 overflow-hidden">

      {/* ================= PRODUTOS ================= */}
      <div className="flex-1 flex flex-col min-h-0">
        <input
          placeholder="Buscar produto..."
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="w-full p-3 border rounded-xl bg-white lg:sticky lg:top-0 z-10"
        />

        {productsLoading && (
          <p className="text-sm text-gray-400 mt-2">Carregando produtos...</p>
        )}

        <div className="flex-1 overflow-y-auto min-h-0 pr-1 mt-2">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredProducts.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl shadow flex flex-col overflow-hidden">

                <div className="relative w-full h-40 bg-gray-100 flex items-center justify-center border-b border-gray-200">
                  {p.catalogo ? (
                    <img
                      src={p.catalogo}
                      alt={p.name}
                      className="w-full h-full object-contain p-4"
                    />
                  ) : (
                    <div className="text-gray-400 text-sm">Sem imagem</div>
                  )}
                </div>

                <div className="p-3 md:p-4 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="font-semibold text-sm md:text-base">{p.name}</h3>
                    <p className="text-xs text-gray-500">{p.category}</p>
                    <p className="text-sm font-medium">MZN {p.price}</p>
                    <p className="text-xs text-gray-400">Estoque: {p.stock}</p>
                  </div>

                  <button
                    onClick={() => handleAdd(p.id)}
                    disabled={addingProductIds.includes(p.id)}
                    className={`mt-3 w-full py-2 rounded-lg text-white flex justify-center items-center gap-2 ${
                      addingProductIds.includes(p.id)
                        ? "bg-gray-500 cursor-not-allowed"
                        : "bg-black hover:brightness-90"
                    }`}
                  >
                    {addingProductIds.includes(p.id) ? (
                      "Adicionando..."
                    ) : (
                      <>
                        <PlusIcon className="w-5 h-5" />
                        Adicionar
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= CARRINHO ================= */}
      <div className="w-full lg:w-96 flex flex-col max-h-[45vh] lg:max-h-full">
        <div className="bg-white p-4 md:p-6 rounded-2xl shadow flex flex-col h-full">

          <h2 className="text-lg md:text-xl font-bold mb-3 flex items-center gap-2">
            <ShoppingCart size={18} />
            Venda Atual
          </h2>

          <div className="flex-1 overflow-y-auto min-h-0">
            {sale?.items.length === 0 ? (
              <p className="text-center text-gray-400">Nenhum item</p>
            ) : (
              sale?.items.map((item) => (
                <div key={item.itemId} className="border-b pb-2">

                  <div className="flex justify-between text-sm md:text-base">
                    <span>{item.productName}</span>
                    <span>MZN {item.subtotal}</span>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => handleQuantity(item.itemId, item.quantity - 1)}
                      disabled={processingItemIds.includes(item.itemId) || item.quantity <= 1}
                      className="w-8 h-8 border rounded"
                    >
                      <Minus size={16} />
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() => handleQuantity(item.itemId, item.quantity + 1)}
                      disabled={processingItemIds.includes(item.itemId)}
                      className="w-8 h-8 border rounded"
                    >
                      <Plus size={16} />
                    </button>

                    <button
                      onClick={() => handleRemove(item.itemId)}
                      disabled={processingItemIds.includes(item.itemId)}
                      className="ml-auto text-red-500 text-sm"
                    >
                      {processingItemIds.includes(item.itemId)
                        ? "processando..."
                        : "Remover"}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-t pt-3 mt-3 space-y-2 text-sm">
            <p>Subtotal: MZN {sale?.subtotal || 0}</p>
            <p>Desconto: MZN {sale?.discount || 0}</p>
            <p className="font-bold text-lg">Total: MZN {sale?.total || 0}</p>

            <button
              onClick={handleArchiveAndRedirect}
              className="w-full bg-yellow-400 text-white py-2 rounded-lg"
            >
              Arquivar
            </button>

            <button
              disabled={sale?.items.length === 0 || finalizing}
              onClick={() => setShowPayment(true)}
              className="w-full bg-green-500 text-white py-3 rounded-lg flex items-center justify-center gap-2"
            >
              {finalizing ? "Finalizando..." : "Finalizar Venda"}
            </button>
          </div>
        </div>
      </div>

      <PaymentModal
        open={showPayment}
        methods={methods}
        onClose={() => setShowPayment(false)}
        onConfirm={handleConfirmPayment}
      />

      {receipt && (
        <ReceiptPreview
          receipt={receipt}
          onClose={() => {
            setReceipt(null);
            router.push(`/attendant/dashboard/${establishmentId}`);
          }}
          onPrint={() => window.print()}
        />
      )}
    </div>
  );
}