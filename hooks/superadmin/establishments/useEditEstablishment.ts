"use client";

import { useState } from "react";
import { editEstablishment } from "@/service/superadmin/establishments/editEstablishment";
import { EditEstablishmentRequest } from "@/types/superadmin/establishments/editEstablishment";

export function useEditEstablishment() {
  const [loading, setLoading] = useState(false);

  async function execute(
    establishmentId: string,
    payload: EditEstablishmentRequest
  ) {
    try {
      setLoading(true);

      return await editEstablishment(
        establishmentId,
        payload
      );
    } finally {
      setLoading(false);
    }
  }

  return {
    execute,
    loading,
  };
}