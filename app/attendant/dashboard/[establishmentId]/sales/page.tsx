"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useSale } from "@/hooks/attendant/useSale";
import { usePaymentMethods } from "@/hooks/attendant/usePaymentMethods";
import { ProductItem } from "@/types/attendant/sale/Product";
import { listProducts } from "@/service/attendant/product";
import { Receipt } from "@/types/attendant/sale/Receipt";
import { PaymentModal } from "@/components/attendant/modals/PaymentModal";
import { ReceiptPreview } from "@/components/attendant/ReceiptPreview";
import { useToast } from "@/ context/ToastContext";

import { PlusIcon, CheckCircleIcon, ArchiveBoxIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { DollarSign, Minus, MinusIcon, Plus, ShoppingCart, ShoppingCartIcon, Trash2, TrashIcon } from "lucide-react";

export default function SalesPage() {
  const params = useParams<{ establishmentId: string }>();
  const search = useSearchParams();
  const router = useRouter();
  const toast = useToast();
  const establishmentId = params.establishmentId;
  const saleId = search.get("saleId");
  const cashRegisterId = search.get("cashRegisterId");

  const {
    sale,
    loading,
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

  const [products, setProducts] = useState<ProductItem[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  const [receipt, setReceipt] = useState<Receipt | null>(null);

  // ================= FLUXO DE VENDA =================
  useEffect(() => {
    async function initSale() {
      if (sale) return;
      if (saleId) await refreshSale(saleId);
      else if (cashRegisterId) await startSale(cashRegisterId);
    }
    initSale();
  }, [saleId, cashRegisterId]);

  // ================= BUSCAR PRODUTOS =================
  const loadProducts = useCallback(async () => {
    setProductsLoading(true);
    const list = await listProducts({ establishmentId, name: searchName || undefined });
    setProducts(list || []);
    setProductsLoading(false);
  }, [searchName, establishmentId]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // ================= CONFIRMAR PAGAMENTO =================  {/* FOTO / CATÁLOGO */}
   

  async function handleConfirmPayment(methodId: string) {
    try {
      setFinalizing(true);
      const receiptData = await handleFinalize(methodId);
      setReceipt(receiptData);
      setShowPayment(false);
      await refreshSale(receiptData.saleNumber);
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
      toast.showToast("Venda arquivada e redirecionando...", "success");
      router.push(`/attendant/dashboard/${establishmentId}/archived-sales`);
    } catch (e: any) {
      toast.showToast(e.message || "Erro ao arquivar venda", "error");
    }
  }

  if (!sale && !receipt) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <span className="animate-spin border-4 border-gray-300 border-t-transparent rounded-full w-12 h-12"></span>
        <span className="text-gray-500 text-lg">Processando venda...</span>
      </div>
    );
  }

  return (
    <div className="flex gap-8 p-6">
     {/* ================= PRODUTOS ================= */}
      <div className="flex-1 space-y-4">
        <input
          placeholder="Buscar produto..."
          className="w-full p-3 border rounded-xl"
          onChange={(e) => setSearchName(e.target.value)}
        />

        {productsLoading && <p className="text-sm text-gray-400">Carregando produtos...</p>}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p: ProductItem) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl shadow hover:shadow-lg transition flex flex-col overflow-hidden"
            >
              {/* FOTO / CATÁLOGO */}
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

              {/* DETALHES */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div className="space-y-1">
                  <h3 className="font-semibold text-gray-800">{p.name}</h3>
                  <p className="text-sm text-gray-500">Categoria: {p.category}</p>
                  <p className="text-sm text-gray-700 font-medium">Preço: MZN {p.price}</p>
                  <p className="text-xs text-gray-400">Estoque: {p.stock}</p>
                </div>

                {/* BOTÃO ADICIONAR */}
                <button
                  onClick={async () => handleAdd(p.id)}
                  disabled={addingProductIds.includes(p.id)}
                  className={`mt-3 w-full py-2 rounded-lg text-white flex justify-center items-center gap-2 transition ${
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
      {/* ================= VENDA ================= */}
     
<div className="w-96 bg-white p-6 rounded-2xl shadow space-y-4">
  {sale?.items.length === 0 && (
    <p className="text-gray-400 text-center flex items-center justify-center gap-2">
      <ShoppingCart size={18} />
      Nenhum item adicionado
    </p>
  )}

  {sale?.items.map((item) => (
    <div key={item.itemId} className="border-b pb-3">
      <div className="flex justify-between font-medium">
        <span className="flex items-center gap-2">
          <ShoppingCart
           size={16} />
          {item.productName}
        </span>

        <span className="flex items-center gap-1">
          <DollarSign size={16} />
          MZN {item.subtotal}
        </span>
      </div>

      <div className="flex items-center gap-2 mt-2">
        <button
          onClick={() => handleQuantity(item.itemId, item.quantity - 1)}
          className="px-2 border rounded flex items-center justify-center"
          disabled={processingItemIds.includes(item.itemId) || item.quantity <= 1}
        >
          <Minus size={16} />
        </button>

        <span>{item.quantity}</span>

        <button
          onClick={() => handleQuantity(item.itemId, item.quantity + 1)}
          className="px-2 border rounded flex items-center justify-center"
          disabled={processingItemIds.includes(item.itemId)}
        >
          <Plus size={16} />
        </button>

        <button
          onClick={() => handleRemove(item.itemId)}
          className="ml-auto text-red-500 text-sm flex items-center gap-1"
          disabled={processingItemIds.includes(item.itemId)}
        >
          <Trash2 size={16} />
          {processingItemIds.includes(item.itemId)
            ? "Processando..."
            : "Remover"}
        </button>
      </div>
    </div>
  ))}

  {/* TOTAIS */}
  <div className="border-t pt-4 space-y-1 text-sm">
    <p className="flex items-center gap-1">
      <DollarSign size={16} />
      Subtotal: MZN {sale?.subtotal}
    </p>

    <p className="flex items-center gap-1">
      <DollarSign size={16} />
      Desconto: MZN {sale?.discount}
    </p>

    <p className="font-bold text-lg flex items-center gap-1">
      <DollarSign size={18} />
      Total: MZN {sale?.total}
    </p>
  </div>

        {/* AÇÕES */}
        <div className="space-y-2 pt-2">
          <button
            onClick={handleArchiveAndRedirect}
            className="w-full bg-yellow-300 text-white py-2 rounded-xl flex items-center gap-2 justify-center
            transition-all duration-200 hover:bg-yellow-500 hover:scale-[1.02] active:scale-[0.98]"
          >
            <ArchiveBoxIcon className="w-5 h-5" />
            Arquivar
          </button>

       <button
        disabled={sale?.items.length === 0 || finalizing}
        onClick={() => setShowPayment(true)}
        className={`w-full bg-green-300 text-white py-3 rounded-xl disabled:opacity-50 flex justify-center items-center gap-2
        transition-all duration-200 hover:bg-green-500 hover:scale-[1.02] active:scale-[0.98]`}
      >
        {finalizing && (
          <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
        )}

        {!finalizing && <CheckCircleIcon className="w-5 h-5" />}

        {finalizing ? "Finalizando..." : "Finalizar Venda"}
      </button>
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
          onClose={() => setReceipt(null)}
          onPrint={() => {
            const printContent = document.getElementById("receipt-print");
            if (printContent) {
              const printWindow = window.open("", "", "width=300,height=600");
              if (printWindow) {
                printWindow.document.write(`
                  <html>
                    <head>
                      <title>Recibo</title>
                      <style>
                        body{font-family:monospace;width:80mm;margin:0;padding:0;}
                        #receipt{width:80mm;font-size:12px;}
                        @page{size:80mm auto;margin:0;}
                        @media print{body{width:80mm;}} img{max-width:100%;}
                      </style>
                    </head>
                    <body>
                      <div id="receipt">${printContent.innerHTML}</div>
                    </body>
                  </html>
                `);
                printWindow.document.close();
                printWindow.focus();
                printWindow.print();
                printWindow.close();
              }
            }
            router.push(`/attendant/dashboard/${establishmentId}`);
          }}
        />
      )}
    </div>
  );
}