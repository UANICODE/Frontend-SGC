"use client";

import { useState } from "react";
import { establishmentService } from "@/service/superadmin/establishment";
import { CreateEstablishmentRequest } from "@/types/superadmin/establishments/createEstablishments";

export function useCreateEstablishment(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);

  async function create(data: CreateEstablishmentRequest) {
    try {
      setLoading(true);
      await establishmentService.create(data);
      onSuccess?.();
    } finally {
      setLoading(false);
    }
  }

  return { create, loading };
}