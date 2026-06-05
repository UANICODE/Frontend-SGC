// providers/EstablishmentBlockProvider.tsx
"use client";

import { BlockWarningPopup } from "@/components/payments/BlockWarningPopup";
import { useBlockWarning } from "@/hooks/payments/useBlockWarning";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export function EstablishmentBlockProvider({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const establishmentId = params.establishmentId as string;
  const { showWarning, warningData, closeWarning } = useBlockWarning(establishmentId);

  // 🔥 Forçar verificação imediata quando o componente montar
  useEffect(() => {
    if (establishmentId) {
      console.log("Provider montado para estabelecimento:", establishmentId);
    }
  }, [establishmentId]);

  return (
    <>
      {children}
      {showWarning && warningData && (
        <BlockWarningPopup
          key={`popup-${Date.now()}`} // 🔥 Força re-render se necessário
          establishmentId={establishmentId}
          blockStartTime={warningData.blockStartTime}
          blockEffectiveTime={warningData.blockEffectiveTime}
          reason={warningData.reason}
          remainingMinutes={warningData.remainingMinutes}
          onClose={closeWarning}
        />
      )}
    </>
  );
}