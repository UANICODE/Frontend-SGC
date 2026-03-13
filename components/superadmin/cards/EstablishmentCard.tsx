// components/superadmin/cards/EstablishmentCard.tsx
"use client";

import { EstablishmentBlockModal } from "@/components/payments/EstablishmentBlockModal";
import { useBlockStatus } from "@/hooks/payments/useBlockStatus";
import { ListEstablishmentsResponse } from "@/types/superadmin/establishment";
import { Mail, Phone, CheckCircle, XCircle, Lock, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";

interface Props {
  establishment: ListEstablishmentsResponse;
  onBlockStatusChange?: () => void;
}

export function EstablishmentCard({ establishment, onBlockStatusChange }: Props) {
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const { hasBlock, isWarning, isBlocked, refetch } = useBlockStatus(establishment.id);

  useEffect(() => {
    refetch();
  }, []);

  const handleSuccess = () => {
    refetch();
    onBlockStatusChange?.();
  };

  // 🔥 Determina o estado do botão
  const getButtonState = () => {
    if (isBlocked) {
      return {
        text: "Estabelecimento Bloqueado",
        icon: Lock,
        bgColor: "bg-gray-100",
        textColor: "text-gray-400",
        hoverColor: "",
        disabled: true,
        tooltip: "Estabelecimento bloqueado. Clique em 'Desativar' no modal."
      };
    }
    
    if (isWarning) {
      return {
        text: "Aviso Ativo",
        icon: AlertTriangle,
        bgColor: "bg-yellow-50",
        textColor: "text-yellow-600",
        hoverColor: "hover:bg-yellow-100",
        disabled: false,
        tooltip: "Gerencie o aviso ativo"
      };
    }
    
    return {
      text: "Bloquear Estabelecimento",
      icon: Lock,
      bgColor: "bg-red-50",
      textColor: "text-red-600",
      hoverColor: "hover:bg-red-100",
      disabled: false,
      tooltip: "Agendar bloqueio para este estabelecimento"
    };
  };

  const buttonState = getButtonState();
  const ButtonIcon = buttonState.icon;

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-4 shadow hover:shadow-lg transition relative">
        
        {/* Badge de status */}
        {hasBlock && (
          <div className="absolute top-2 right-2">
            <span className={`${
              isBlocked 
                ? 'bg-red-100 text-red-600' 
                : 'bg-yellow-100 text-yellow-600'
            } text-xs px-2 py-1 rounded-full flex items-center gap-1 font-medium`}>
              {isBlocked ? <Lock size={12} /> : <AlertTriangle size={12} />}
              {isBlocked ? 'Bloqueado' : 'Aviso Ativo'}
            </span>
          </div>
        )}

        {/* Logo + Nome */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-lg overflow-hidden border flex items-center justify-center bg-gray-50 shrink-0">
            {establishment.logoUrl ? (
              <img
                src={establishment.logoUrl}
                alt={establishment.tradeName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs text-gray-400">Sem Logo</span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-gray-900 truncate">{establishment.tradeName}</h3>
            <p className="text-sm text-gray-500 truncate">{establishment.legalName}</p>
          </div>
        </div>

        {/* Informações */}
        <div className="text-sm space-y-1">
          <p className="flex items-center gap-2 truncate">
            <Mail size={14} className="text-gray-400" /> {establishment.email}
          </p>
          <p className="flex items-center gap-2 truncate">
            <Phone size={14} className="text-gray-400" /> {establishment.phone || "-"}
          </p>
          <p className="flex items-center gap-2">
            {establishment.active ? (
              <CheckCircle size={14} className="text-green-500" />
            ) : (
              <XCircle size={14} className="text-red-500" />
            )}
            Status: {establishment.active ? "Ativo" : "Inativo"}
          </p>
        </div>

        {/* 🔥 Botão de bloqueio/aviso com tooltip */}
        <div className="relative group">
          <button
            onClick={() => !buttonState.disabled && setBlockModalOpen(true)}
            disabled={buttonState.disabled}
            className={`mt-2 w-full font-medium py-2 px-4 rounded-lg transition flex items-center justify-center gap-2 text-sm ${
              buttonState.bgColor
            } ${buttonState.textColor} ${buttonState.hoverColor} ${
              buttonState.disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
            }`}
            title={buttonState.tooltip}
          >
            <ButtonIcon size={16} />
            {buttonState.text}
          </button>
          
          {/* Tooltip para botão desabilitado */}
          {buttonState.disabled && (
            <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
              {buttonState.tooltip}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
            </div>
          )}
        </div>

        {/* 🔥 Texto informativo quando há aviso ativo */}
        {isWarning && (
          <p className="text-xs text-yellow-600 text-center mt-1">
            ⚠️ Aviso ativo. Clique em "Gerenciar" para desativar.
          </p>
        )}
      </div>

      {/* Modal sempre abre (o botão controla quando pode abrir) */}
      <EstablishmentBlockModal
        establishmentId={establishment.id}
        establishmentName={establishment.tradeName}
        open={blockModalOpen}
        onClose={() => setBlockModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </>
  );
}