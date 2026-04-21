// app/attendant/dashboard/[establishmentId]/sales/page.tsx
"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useSale } from "@/hooks/attendant/useSale";
import { usePaymentMethods } from "@/hooks/attendant/usePaymentMethods";
import { ProductItem } from "@/types/attendant/sale/Product";
import { SaleItem } from "@/types/attendant/sale/Sale";
import { listProducts } from "@/service/attendant/product";
import { Receipt } from "@/types/attendant/sale/Receipt";
import { PaymentModal } from "@/components/attendant/modals/PaymentModal";
import { ReceiptPreview } from "@/components/attendant/ReceiptPreview";
import { useToast } from "@/ context/ToastContext";
import { UserRole } from "@/enum/enum";
import { useRoleGuard } from "@/hooks/auth/useRoleGuard";

import { PlusIcon, CheckCircleIcon, PencilIcon } from "@heroicons/react/24/outline";
import { Minus, Plus, ShoppingCart, Scale, PrinterIcon } from "lucide-react";
import { WeightProductModal } from "@/components/attendant/modals/WeightProductModal";

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
    handleAddByWeight,
    handleRemove,
    handleQuantity,
    handleArchive,
    handleFinalize,
     handleGenerateReceipt,
  } = useSale(establishmentId);

  const { methods } = usePaymentMethods();

  // 🔥 ESTADOS
  const [allProducts, setAllProducts] = useState<ProductItem[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [printingReceipt, setPrintingReceipt] = useState(false);


  // 🆕 Estados para modal de produto por peso
  const [weightModalOpen, setWeightModalOpen] = useState(false);
  const [selectedWeightProduct, setSelectedWeightProduct] = useState<ProductItem | null>(null);
  const [editingWeightItem, setEditingWeightItem] = useState<{ itemId: string; weight: number } | null>(null);

  // ================= INIT =================
  useEffect(() => {
    async function initSale() {
      if (sale) return;
      if (saleId) await refreshSale(saleId);
      else if (cashRegisterId) await startSale(cashRegisterId);
    }
    initSale();
  }, [saleId, cashRegisterId]);

  // ================= PRODUTOS =================
  const loadProducts = useCallback(async () => {
    setProductsLoading(true);
    try {
      const list = await listProducts({ establishmentId });
      setAllProducts(list || []);
    } catch (e) {
      toast.showToast("Erro ao carregar produtos", "error");
    } finally {
      setProductsLoading(false);
    }
  }, [establishmentId, toast]);

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

  // ================= HANDLERS =================
 const handleProductClick = (product: ProductItem) => {
  console.log("🔍 Produto clicado:", {
    id: product.id,
    name: product.name,
    isWeightBased: product.isWeightBased,
    isFixedPortion: product.isFixedPortion
  });
  
  // Produto por peso
  if (product.isWeightBased) {
    console.log("✅ Produto por peso detectado, abrindo modal");
    setSelectedWeightProduct(product);
    setEditingWeightItem(null);
    setWeightModalOpen(true);
    return;
  }
  
  // Produto normal ou com porção fixa
  console.log("✅ Produto normal, chamando handleAdd");
  handleAdd(product.id);
};

async function handlePrintReceipt() {
  //console.log("🖨️ Tentando imprimir recibo...", { sale: sale?.saleId, saleIdParam: saleId });
  
  // Se não tem venda no estado, mas tem saleId na URL, tenta carregar
  if (!sale && saleId) {
    //console.log("📦 Venda não carregada, tentando carregar...");
    await refreshSale(saleId);
    // Aguarda um momento para o estado atualizar
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Verifica novamente após tentar carregar
  if (!sale) {
    toast.showToast("Nenhuma venda ativa. Inicie uma nova venda primeiro.", "error");
    return;
  }
  
  if (sale.items.length === 0) {
    toast.showToast("Carrinho vazio, não há o que imprimir", "error");
    return;
  }
  
  try {
    setPrintingReceipt(true);
    const receiptData = await handleGenerateReceipt();
    setReceipt(receiptData);
  } catch (e: any) {
   // console.error("Erro ao gerar recibo:", e);
    toast.showToast(e.message || "Erro ao gerar recibo", "error");
  } finally {
    setPrintingReceipt(false);
  }
}

const handleEditItem = (item: SaleItem) => {
  const product = allProducts.find(p => p.id === item.productId);
  
  if (product?.isWeightBased) {
    setEditingWeightItem({
      itemId: item.itemId,
      weight: item.quantity,
    });
    setSelectedWeightProduct(product);
    setWeightModalOpen(true);
  }
};

  const handleWeightConfirm = async (weightInGrams: number, totalPrice: number) => {
    if (editingWeightItem) {
      // Atualizar item existente - a quantidade será o novo peso
      await handleQuantity(editingWeightItem.itemId, weightInGrams);
      toast.showToast("Peso atualizado com sucesso!", "success");
    } else {
      // Adicionar novo item
      await handleAddByWeight(selectedWeightProduct!.id, weightInGrams, totalPrice);
    }
    setEditingWeightItem(null);
    setSelectedWeightProduct(null);
  };

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
          className="w-full p-3 border rounded-xl bg-white lg:sticky lg:top-0 z-10 focus:outline-none focus:ring-2 focus:ring-primary"
        />

        {productsLoading && (
          <p className="text-sm text-gray-400 mt-2">Carregando produtos...</p>
        )}

        <div className="flex-1 overflow-y-auto min-h-0 pr-1 mt-2">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((p, index) => (
            <div 
              key={`prod-${p.id}-${index}`}
              className="bg-white rounded-2xl shadow flex flex-col overflow-hidden hover:shadow-lg transition cursor-pointer"
              onClick={() => handleProductClick(p)}
            >
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
                  
                  {/* Badge para identificar tipo de produto */}
                  {p.isWeightBased && (
                    <span className="absolute top-2 right-2 bg-purple-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <Scale size={12} />
                      Por peso
                    </span>
                  )}
                  {p.isFixedPortion && (
                    <span className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                      Porção fixa
                    </span>
                  )}
                </div>

                <div className="p-3 md:p-4 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="font-semibold text-sm md:text-base">{p.name}</h3>
                    <p className="text-xs text-gray-500">{p.category}</p>
                    
                    {p.isWeightBased ? (
                      <p className="text-sm font-medium text-purple-600">
                        {p.pricePerGram?.toFixed(2)} MZN/g
                      </p>
                    ) : (
                      <p className="text-sm font-medium">MZN {p.price?.toFixed(2)}</p>
                    )}
                    
                    <p className="text-xs text-gray-400">Estoque: {p.stock}</p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProductClick(p);
                    }}
                    disabled={addingProductIds.includes(p.id)}
                    className={`mt-3 w-full py-2 rounded-lg text-white flex justify-center items-center gap-2 ${
                      addingProductIds.includes(p.id)
                        ? "bg-gray-400 cursor-not-allowed"
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

          <div className="flex-1 overflow-y-auto min-h-0 space-y-3">
            {sale?.items.length === 0 ? (
              <p className="text-center text-gray-400 py-8">Nenhum item adicionado</p>
            ) : (
              sale?.items.map((item, index) => {
                const product = allProducts.find(p => p.id === item.productId);
                const isWeightBased = product?.isWeightBased || item.isWeightBased;
                
                return (
                  <div key={`cart-${item.itemId}-${index}`} className="border-b pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <span className="font-medium text-sm">{item.productName}</span>
                        {isWeightBased ? (
                          <p className="text-xs text-gray-500">
                            {item.quantity}g × {product?.pricePerGram?.toFixed(2)} MZN/g
                          </p>
                        ) : (
                          <p className="text-xs text-gray-500">
                            {item.quantity} × MZN {(item.unitPrice / item.quantity).toFixed(2)}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="font-semibold">MZN {item.subtotal.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      {/* 🔥 Para produtos por peso: NÃO mostrar botões + e - */}
                      {!isWeightBased && (
                        <>
                          <button
                            onClick={() => handleQuantity(item.itemId, item.quantity - 1)}
                            disabled={processingItemIds.includes(item.itemId) || item.quantity <= 1}
                            className="w-8 h-8 border rounded flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
                          >
                            <Minus size={14} />
                          </button>

                          <span className="w-16 text-center text-sm">{item.quantity}</span>

                          <button
                            onClick={() => handleQuantity(item.itemId, item.quantity + 1)}
                            disabled={processingItemIds.includes(item.itemId)}
                            className="w-8 h-8 border rounded flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
                          >
                            <Plus size={14} />
                          </button>
                        </>
                      )}

                      {/* 🔥 Para produtos por peso: Mostrar o peso e botão editar */}
                      {isWeightBased && (
                        <div className="flex items-center gap-2 flex-1">
                          <span className="text-sm font-medium text-purple-600">
                            {item.quantity}g
                          </span>
                          <button
                            onClick={() => {
                              setEditingWeightItem({
                                itemId: item.itemId,
                                weight: item.quantity,
                              });
                              setSelectedWeightProduct(product || null);
                              setWeightModalOpen(true);
                            }}
                            disabled={processingItemIds.includes(item.itemId)}
                            className="text-blue-500 text-sm flex items-center gap-1 hover:text-blue-700"
                          >
                            <PencilIcon className="w-4 h-4" />
                            Editar peso
                          </button>
                        </div>
                      )}


                      <button
                        onClick={() => handleRemove(item.itemId)}
                        disabled={processingItemIds.includes(item.itemId)}
                        className="ml-auto text-red-500 text-sm hover:text-red-700"
                      >
                        {processingItemIds.includes(item.itemId) ? "processando..." : "Remover"}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="border-t pt-3 mt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>MZN {sale?.subtotal?.toFixed(2) || "0.00"}</span>
            </div>
            <div className="flex justify-between">
              <span>Desconto:</span>
              <span>MZN {sale?.discount?.toFixed(2) || "0.00"}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2">
              <span>Total:</span>
              <span className="text-primary">MZN {sale?.total?.toFixed(2) || "0.00"}</span>
            </div>

        {/* 🆕 BOTÃO IMPRIMIR RECIBO */}
          <button
            onClick={handlePrintReceipt}
            disabled={sale?.items.length === 0 || printingReceipt}
            className={`w-full py-2 rounded-lg flex items-center justify-center gap-2 transition ${
              sale?.items.length === 0 || printingReceipt
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            {printingReceipt ? (
              "Gerando..."
            ) : (
              <>
                <PrinterIcon className="w-5 h-5" />
                Imprimir Recibo
              </>
            )}
          </button>

            <button
              onClick={handleArchiveAndRedirect}
              className="w-full bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition"
            >
              Arquivar
            </button>

            <button
              disabled={sale?.items.length === 0 || finalizing}
              onClick={() => setShowPayment(true)}
              className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 transition ${
                sale?.items.length === 0 || finalizing
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600 text-white"
              }`}
            >
              {finalizing ? (
                "Finalizando..."
              ) : (
                <>
                  <CheckCircleIcon className="w-5 h-5" />
                  Finalizar Venda
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Modais */}
      <PaymentModal
        open={showPayment}
        methods={methods}
        onClose={() => setShowPayment(false)}
        onConfirm={handleConfirmPayment}
      />

      <WeightProductModal
        open={weightModalOpen}
        product={selectedWeightProduct}
        existingWeight={editingWeightItem?.weight}
        onClose={() => {
          setWeightModalOpen(false);
          setSelectedWeightProduct(null);
          setEditingWeightItem(null);
        }}
        onConfirm={handleWeightConfirm}
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