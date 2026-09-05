
"use client";

import { useParams } from "next/navigation";
import { useState, useMemo } from "react";
import { 
    Search, 
    ListChecks, 
    Package, 
    Filter, 
    FileText, 
    ShoppingCart,
    History,
    TrendingUp
} from "lucide-react";

import { ProductStockTable } from "@/components/admin/tables/ProductStockTable";
import { RemoveStockModal } from "@/components/admin/modals/RemoveStockModal";
import { CartButton } from "@/components/admin/CartButton";
import { CartModal } from "@/components/admin/modals/CartModal";
import { DropdownMenu } from "@/components/admin/DropdownMenu";
import { useProductStocks } from "@/hooks/admin/product/stock/useProductStocks";
import { useCart } from "@/hooks/admin/purchase/useCart";
import { useToast } from "@/ context/ToastContext";
import { UserRole } from "@/enum/enum";
import { useRoleGuard } from "@/hooks/auth/useRoleGuard";
import { useStockMovements } from "@/hooks/admin/product/stock/useStockMovements";
import { StockMovementsModal } from "@/components/admin/modals/StockMovementsModal";
import { TransferStockModal } from "@/components/admin/modals/TransferStockModal";
import { ReportFilterModal } from "@/components/admin/modals/ReportFilterModal";
import { usePurchasesReport } from "@/hooks/report/usePurchasesReport";
import { useSuppliers } from "@/hooks/admin/supplier/useSuppliers";
import { useEstablishment } from "@/hooks/admin/useEstablishment"; // 🆕
import { generatePurchasesPDF } from "@/utils/pdfGenerator";

export default function ProductStockPage() {
    useRoleGuard([UserRole.ADMIN]);

    const params = useParams();
    const establishmentIdParam = Array.isArray(params.establishmentId)
        ? params.establishmentId[0]
        : params.establishmentId;

    const establishmentId = establishmentIdParam || "";

    const { showToast } = useToast();
    
    // 🔥 Buscar dados do estabelecimento
    const { data: establishment } = useEstablishment(establishmentId);
    
    const { data, loading, refresh } = useProductStocks(establishmentId);
    const { 
        data: movements, 
        loading: loadingMovements, 
        fetch: fetchMovements 
    } = useStockMovements();
    const { 
        items, 
        totalItems, 
        addItem, 
        removeItem, 
        updateQuantity, 
        updatePurchasePrice, 
        clearCart 
    } = useCart();

    // Estados
    const [selected, setSelected] = useState<any>(null);
    const [removeItemState, setRemoveItemState] = useState<any>(null);
    const [selectedTransfer, setSelectedTransfer] = useState<any>(null);
    const [openMovements, setOpenMovements] = useState(false);
    const [openTransfer, setOpenTransfer] = useState(false);
    const [openCart, setOpenCart] = useState(false);
    const [nameFilter, setNameFilter] = useState("");
    const [quantityFilter, setQuantityFilter] = useState<number | "">("");
    const { fetch: fetchPurchasesReport, loading: reportLoading } = usePurchasesReport(establishmentId);
    const { data: suppliers } = useSuppliers(establishmentId);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [filters, setFilters] = useState({ supplierId: "", startDate: "", endDate: "" });

    const filteredData = useMemo(() => {
        if (!data?.content) return [];
        return data.content.filter((item: any) => {
            const matchesName = item.productName.toLowerCase().includes(nameFilter.toLowerCase());
            const matchesQuantity = quantityFilter === "" || item.quantity === quantityFilter;
            return matchesName && matchesQuantity;
        });
    }, [data?.content, nameFilter, quantityFilter]);

   // app/admin/dashboard/[establishmentId]/product/stock/page.tsx

const handleGenerateReport = async (appliedFilters?: any) => {
    try {
        const { status, ...validFilters } = appliedFilters || filters;
        
        const response = await fetchPurchasesReport({
            establishmentId,
            ...validFilters,
        });
        
        if (!response) {
            showToast("Nenhum dado encontrado para o relatório", "error");
            return;
        }
        
        const establishmentName = establishment?.tradeName || "Estabelecimento";
        
        // 🔥 O PDF generator agora recebe o objeto completo
        const pdfDataUrl = generatePurchasesPDF(response, {
            title: "Relatório de Compras",
            subtitle: "Histórico completo de compras do estabelecimento",
            establishmentName: establishmentName,
            primaryColor: establishment?.primaryColor || "#4F46E5",
            secondaryColor: establishment?.secondaryColor || "#7C3AED",
            periodStart: appliedFilters?.startDate || filters.startDate,
            periodEnd: appliedFilters?.endDate || filters.endDate,
        });

        const link = document.createElement("a");
        link.download = `Relatorio_Compras_${new Date().toISOString().split("T")[0]}.pdf`;
        link.href = pdfDataUrl;
        link.click();

        showToast("Relatório gerado com sucesso!", "success");
    } catch (error) {
        // Error handled by hook
    }
};

    const handleAddToCart = (item: any) => {
        addItem({
            productId: item.productId,
            productName: item.productName,
            quantity: 1,
            purchasePrice: 0,
            stockQuantity: item.quantity,
            price: 0,
        });
        showToast(`${item.productName} adicionado ao carrinho!`, "success");
    };

    if (!establishmentId) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-center text-red-500 py-10">
                    ID do estabelecimento não encontrado
                </p>
            </div>
        );
    }

    const dropdownItems = [
        {
            label: "Ver Movimentos",
            icon: <History className="w-4 h-4" />,
            onClick: async () => {
                setOpenMovements(true);
                await fetchMovements(establishmentId);
            },
        },
        {
            label: "Relatório de Compras",
            icon: <FileText className="w-4 h-4" />,
            onClick: () => setShowFilterModal(true),
            variant: 'success' as const,
        },
        {
            label: "Filtros",
            icon: <Filter className="w-4 h-4" />,
            onClick: () => setShowFilterModal(true),
        },
    ];

    return (
        <div className="space-y-6">
            {/* HEADER */}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-primary flex gap-2 items-center">
                    <Package className="w-7 h-7" /> Gestão de Stock
                </h1>

                <div className="flex items-center gap-3">
                    <DropdownMenu
                        label="Opções"
                        icon={<TrendingUp className="w-4 h-4" />}
                        items={dropdownItems}
                        variant="primary"
                    />

                    <CartButton itemCount={totalItems} onClick={() => setOpenCart(true)} />
                </div>
            </div>

            {/* FILTROS */}
            <div className="flex gap-4">
                <div className="flex items-center border rounded-xl px-3 py-2 flex-1 bg-white">
                    <Search className="w-5 h-5 text-gray-400 mr-2" />
                    <input
                        placeholder="Filtrar por nome do produto"
                        value={nameFilter}
                        onChange={(e) => setNameFilter(e.target.value)}
                        className="outline-none flex-1"
                    />
                </div>

                <div className="flex items-center border rounded-xl px-3 py-2 w-40 bg-white">
                    <ListChecks className="w-5 h-5 text-gray-400 mr-2" />
                    <input
                        type="number"
                        placeholder="Quantidade"
                        value={quantityFilter}
                        onChange={(e) => setQuantityFilter(e.target.value === "" ? "" : Number(e.target.value))}
                        className="outline-none flex-1"
                    />
                </div>

                <button
                    onClick={() => {
                        setNameFilter("");
                        setQuantityFilter("");
                    }}
                    className="text-sm text-primary underline hover:text-primary/80"
                >
                    Limpar
                </button>
            </div>

            {/* TABELA */}
            <ProductStockTable
                data={filteredData}
                loading={loading}
                onRemove={setRemoveItemState}
                onTransfer={(item) => {
                    setSelectedTransfer(item);
                    setOpenTransfer(true);
                }}
                onAddToCart={handleAddToCart}
            />

            {/* MODAIS */}
            {removeItemState && (
                <RemoveStockModal
                    establishmentId={establishmentId}
                    item={removeItemState}
                    onClose={() => setRemoveItemState(null)}
                    onSuccess={() => {
                        refresh();
                        showToast("Stock removido com sucesso!", "success");
                    }}
                />
            )}

            {openTransfer && selectedTransfer && (
                <TransferStockModal
                    open={openTransfer}
                    onClose={() => setOpenTransfer(false)}
                    product={selectedTransfer}
                    currentEstablishmentId={establishmentId}
                    onSuccess={() => {
                        refresh();
                        showToast("Transferência feita com sucesso!", "success");
                    }}
                />
            )}

            {openCart && (
                <CartModal
                    establishmentId={establishmentId}
                    items={items}
                    totalQuantity={items.reduce((acc: number, it: any) => acc + (it.quantity || 0), 0)}
                    onClose={() => setOpenCart(false)}
                    onSuccess={() => {
                        refresh();
                        showToast("Compra registrada com sucesso!", "success");
                    }}
                    onRemoveItem={removeItem}
                    onUpdateQuantity={updateQuantity}
                    onUpdatePrice={updatePurchasePrice}
                    clearCart={clearCart}
                />
            )}

            <StockMovementsModal
                open={openMovements}
                onClose={() => setOpenMovements(false)}
                data={movements}
                loading={loadingMovements}
            />

            <ReportFilterModal
                open={showFilterModal}
                onClose={() => setShowFilterModal(false)}
                onApply={(applied) => {
                    setFilters(applied);
                    handleGenerateReport(applied);
                }}
                title="Filtros para Relatório de Compras"
                showSupplier={true}
                suppliers={suppliers?.content || []}
            />
        </div>
    );
}