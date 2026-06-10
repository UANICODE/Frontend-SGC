// components/attendant/modals/CashRegisterSalesModal.tsx
"use client";

import { useMemo, useState, useEffect } from "react";
import { CashRegisterSale } from "@/types/attendant/CashRegister";
import {
  XMarkIcon,
  ChevronDownIcon,
  ShoppingCartIcon,
  CalendarIcon,
  CreditCardIcon,
  FunnelIcon,
  DocumentArrowDownIcon,
  BanknotesIcon,
  TagIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Props {
  open: boolean;
  onClose: () => void;
  sales: CashRegisterSale[];
  loading: boolean;
  primaryColor: string;
  secondaryColor: string;
  cashRegisterInfo?: {
    openedAt: string;
    closedAt?: string;
    totalSales: number;
  };
  establishmentLogo?: string;
  establishmentName?: string;
  establishmentAddress?: string;
  establishmentPhone?: string;
}

export function CashRegisterSalesModal({
  open,
  onClose,
  sales,
  loading,
  primaryColor,
  secondaryColor,
  cashRegisterInfo,
  establishmentLogo,
  establishmentName,
  establishmentAddress,
  establishmentPhone,
}: Props) {
  const [openSale, setOpenSale] = useState<string | null>(null);
  const [method, setMethod] = useState("");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [date, setDate] = useState("");
  const [searchItems, setSearchItems] = useState<Record<string, string>>({});
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const [currentAttendantName, setCurrentAttendantName] = useState<string>("");

  // Pegar o nome do atendente da primeira venda (ou do usuário logado)
  useEffect(() => {
    if (sales.length > 0 && sales[0].attendantName) {
      setCurrentAttendantName(sales[0].attendantName);
    }
  }, [sales]);

  useEffect(() => {
    if (establishmentLogo) {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = establishmentLogo;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0);
        setLogoImage(canvas.toDataURL("image/png"));
      };
    }
  }, [establishmentLogo]);

  const filteredSales = useMemo(() => {
    return sales.filter((s) => {
      const matchMethod = method ? s.paymentMethod === method : true;
      const matchMin = min ? s.total >= Number(min) : true;
      const matchMax = max ? s.total <= Number(max) : true;
      const matchDate = date
        ? new Date(s.createdAt).toISOString().slice(0, 10) === date
        : true;
      return matchMethod && matchMin && matchMax && matchDate;
    });
  }, [sales, method, min, max, date]);

  const methods = [...new Set(sales.map((s) => s.paymentMethod))];
  const hasFilters = method || min || max || date;

  const clearFilters = () => {
    setMethod("");
    setMin("");
    setMax("");
    setDate("");
  };

  const totalVendas = filteredSales.length;
  const totalReceita = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
  const totalDesconto = filteredSales.reduce((sum, sale) => sum + sale.discount, 0);

  const exportToPDF = () => {
    const doc = new jsPDF();
    const primaryRGB = hexToRgb(primaryColor);
    
    let yPos = 15;

    // ================= CABECALHO =================
    if (logoImage) {
      doc.addImage(logoImage, "PNG", 14, yPos, 25, 25);
      doc.setFontSize(18);
      doc.setTextColor(primaryRGB?.r || 0, primaryRGB?.g || 0, primaryRGB?.b || 0);
      doc.text(establishmentName || "Estabelecimento", 45, yPos + 12);
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      if (establishmentAddress) doc.text(establishmentAddress, 45, yPos + 20);
      if (establishmentPhone) doc.text(`Tel: ${establishmentPhone}`, 45, yPos + 26);
    } else {
      doc.setFontSize(20);
      doc.setTextColor(primaryRGB?.r || 0, primaryRGB?.g || 0, primaryRGB?.b || 0);
      doc.text(establishmentName || "RELATORIO DE VENDAS", 14, yPos + 12);
    }

    yPos = 55;

    // Titulo
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("RELATORIO DE VENDAS DO CAIXA", 14, yPos);
    yPos += 6;
    doc.setDrawColor(primaryRGB?.r || 0, primaryRGB?.g || 0, primaryRGB?.b || 0);
    doc.line(14, yPos, 200, yPos);
    yPos += 8;

    // Informacoes do periodo
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    if (cashRegisterInfo) {
      doc.text(`Abertura: ${new Date(cashRegisterInfo.openedAt).toLocaleString()}`, 14, yPos);
      yPos += 5;
      if (cashRegisterInfo.closedAt) {
        doc.text(`Fechamento: ${new Date(cashRegisterInfo.closedAt).toLocaleString()}`, 14, yPos);
        yPos += 5;
      }
    }
    doc.text(`Emitido em: ${new Date().toLocaleString()}`, 14, yPos);
    yPos += 12;

    // Atendente responsavel
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(`Atendente Responsavel: ${currentAttendantName || "Nao informado"}`, 14, yPos);
    yPos += 8;

    // Cards de resumo
    const cardWidth = 55;
    const cardHeight = 30;
    const startX = 14;

    doc.setFillColor(240, 248, 255);
    doc.rect(startX, yPos, cardWidth, cardHeight, "F");
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text("Total de Vendas", startX + 5, yPos + 8);
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text(totalVendas.toString(), startX + 5, yPos + 23);

    doc.setFillColor(240, 255, 240);
    doc.rect(startX + cardWidth + 5, yPos, cardWidth, cardHeight, "F");
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text("Receita Total", startX + cardWidth + 10, yPos + 8);
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`MZN ${totalReceita.toFixed(2)}`, startX + cardWidth + 10, yPos + 23);

    doc.setFillColor(255, 245, 235);
    doc.rect(startX + (cardWidth + 5) * 2, yPos, cardWidth, cardHeight, "F");
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text("Descontos", startX + (cardWidth + 5) * 2 + 5, yPos + 8);
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`MZN ${totalDesconto.toFixed(2)}`, startX + (cardWidth + 5) * 2 + 5, yPos + 23);

    yPos += cardHeight + 10;

    // ================= TABELA UNICA DE PRODUTOS =================
    const allProducts: any[] = [];
    
    filteredSales.forEach((sale) => {
      sale.items.forEach((item) => {
        allProducts.push({
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          subtotal: item.subtotal,
          saleNumber: sale.saleNumber.slice(0, 8),
          saleDate: new Date(sale.createdAt).toLocaleDateString(),
        });
      });
    });

    const tableData = allProducts.map((product, idx) => [
      (idx + 1).toString(),
      product.productName,
      product.quantity.toString(),
      `MZN ${product.unitPrice.toFixed(2)}`,
      `MZN ${product.subtotal.toFixed(2)}`,
      product.saleNumber,
      product.saleDate,
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [["#", "Produto", "Qtd", "Preco Unit.", "Subtotal", "Venda", "Data"]],
      body: tableData,
      theme: "striped",
      headStyles: { fillColor: [primaryRGB?.r || 79, primaryRGB?.g || 70, primaryRGB?.b || 229], textColor: [255, 255, 255], fontStyle: "bold" },
      styles: { fontSize: 8, cellPadding: 3 },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 50 },
        2: { cellWidth: 15 },
        3: { cellWidth: 25 },
        4: { cellWidth: 25 },
        5: { cellWidth: 30 },
        6: { cellWidth: 25 },
      },
    });

    const finalY = (doc as any).lastAutoTable?.finalY || yPos + 50;

    // ================= ASSINATURAS =================
    const signatureY = finalY + 15;

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text("_________________________________________", 30, signatureY);
    doc.text("_________________________________________", 130, signatureY);
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text("Assinatura do Atendente", 45, signatureY + 5);
    doc.text("Assinatura do Gerente", 145, signatureY + 5);


   
    // ================= RODAPE =================
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(7);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `SGC - Mozambique | www.uanicode.com | Pagina ${i} de ${pageCount}`,
        doc.internal.pageSize.getWidth() / 2,
        doc.internal.pageSize.getHeight() - 8,
        { align: "center" }
      );
    }

    doc.save(`Relatorio_Vendas_Caixa_${new Date().toISOString().slice(0, 19)}.pdf`);
  };

  function hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
      : null;
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white w-full max-w-7xl rounded-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Header com gradiente */}
        <div 
          className="sticky top-0 z-10 rounded-t-2xl px-6 py-4"
          style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                <ShoppingCartIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Vendas do Caixa</h2>
                {cashRegisterInfo && (
                  <p className="text-white/80 text-sm">
                    {cashRegisterInfo.closedAt ? 'Caixa Fechado' : 'Caixa Aberto'} • 
                    {new Date(cashRegisterInfo.openedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
              <XMarkIcon className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Cards de Resumo */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
              <div className="flex items-center gap-2 text-blue-600 mb-2">
                <BanknotesIcon className="w-5 h-5" />
                <span className="text-xs font-semibold uppercase">Total de Vendas</span>
              </div>
              <p className="text-2xl font-bold text-blue-700">{totalVendas}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
              <div className="flex items-center gap-2 text-green-600 mb-2">
                <CurrencyDollarIcon className="w-5 h-5" />
                <span className="text-xs font-semibold uppercase">Receita Total</span>
              </div>
              <p className="text-2xl font-bold text-green-700">MZN {totalReceita.toFixed(2)}</p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-100">
              <div className="flex items-center gap-2 text-orange-600 mb-2">
                <TagIcon className="w-5 h-5" />
                <span className="text-xs font-semibold uppercase">Descontos</span>
              </div>
              <p className="text-2xl font-bold text-orange-700">MZN {totalDesconto.toFixed(2)}</p>
            </div>
          </div>

          {/* Filtros */}
          <div className="bg-gray-50 p-4 rounded-xl space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 font-semibold text-gray-700">
                <FunnelIcon className="w-5 h-5" />
                <span>Filtros</span>
              </div>
              {hasFilters && (
                <button onClick={clearFilters} className="text-sm text-red-500 hover:underline">
                  Limpar filtros
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <select value={method} onChange={(e) => setMethod(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg">
                <option value="">Todos os metodos</option>
                {methods.map((m) => (<option key={m} value={m}>{m}</option>))}
              </select>
              <input type="number" placeholder="Valor minimo" value={min} onChange={(e) => setMin(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg" />
              <input type="number" placeholder="Valor maximo" value={max} onChange={(e) => setMax(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg" />
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg" />
            </div>
          </div>

          {/* Botao Exportar */}
          {filteredSales.length > 0 && (
            <div className="flex justify-end">
              <button onClick={exportToPDF} className="px-4 py-2 rounded-lg text-white flex items-center gap-2 hover:opacity-90 transition-opacity" style={{ backgroundColor: secondaryColor }}>
                <DocumentArrowDownIcon className="w-5 h-5" />
                Exportar para PDF
              </button>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-t-transparent" style={{ borderColor: `${primaryColor}20`, borderTopColor: primaryColor }}></div>
            </div>
          )}

          {/* Sem resultados */}
          {!loading && filteredSales.length === 0 && (
            <div className="text-center py-10">
              <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <ShoppingCartIcon className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-lg font-medium text-gray-600">Nenhuma venda encontrada</p>
              <p className="text-sm text-gray-400">Tente ajustar os filtros aplicados</p>
            </div>
          )}

          {/* Lista de Vendas (frontend) */}
          {!loading && filteredSales.length > 0 && (
            <div className="space-y-4">
              {filteredSales.map((sale) => {
                const search = searchItems[sale.saleNumber] || "";
                const items = sale.items.filter((i) => i.productName.toLowerCase().includes(search.toLowerCase()));
                return (
                  <div key={sale.saleNumber} className="border rounded-xl overflow-hidden">
                    <div className="p-4 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => setOpenSale(openSale === sale.saleNumber ? null : sale.saleNumber)}>
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#10b981" }}></div>
                            <p className="font-mono text-sm font-semibold text-gray-700">Venda #{sale.saleNumber.slice(0, 8)}</p>
                          </div>
                          <p className="text-sm text-gray-500 flex items-center gap-2"><CreditCardIcon className="w-4 h-4" />{sale.paymentMethod}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-400">
                            <span className="flex items-center gap-1"><CalendarIcon className="w-3 h-3" />{new Date(sale.createdAt).toLocaleString()}</span>
                            {sale.attendantName && <span>Atendente: {sale.attendantName}</span>}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold" style={{ color: primaryColor }}>MZN {sale.total.toFixed(2)}</p>
                          {sale.discount > 0 && <p className="text-xs text-green-600">Desconto: MZN {sale.discount.toFixed(2)}</p>}
                        </div>
                        <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform ${openSale === sale.saleNumber ? "rotate-180" : ""}`} />
                      </div>
                    </div>
                    {openSale === sale.saleNumber && (
                      <div className="border-t bg-gray-50 p-4 space-y-3">
                        <input type="text" placeholder="Buscar produto..." value={search} onChange={(e) => setSearchItems({ ...searchItems, [sale.saleNumber]: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
                        <div className="space-y-2">
                          {items.map((item, i) => (
                            <div key={i} className="bg-white rounded-lg p-3 flex items-center gap-3">
                              <img src={item.imageUrl || "/placeholder.png"} alt={item.productName} className="w-12 h-12 rounded-lg object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.png"; }} />
                              <div className="flex-1"><p className="font-medium text-sm">{item.productName}</p><p className="text-xs text-gray-500">{item.quantity} x MZN {item.unitPrice.toFixed(2)}</p></div>
                              <p className="font-semibold text-sm" style={{ color: primaryColor }}>MZN {item.subtotal.toFixed(2)}</p>
                            </div>
                          ))}
                        </div>
                        {items.length === 0 && <p className="text-sm text-gray-400 text-center py-4">Nenhum produto encontrado</p>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}