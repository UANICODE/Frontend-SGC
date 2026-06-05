"use client";

import { useState } from "react";
import { CreateEstablishmentRequest } from "@/types/superadmin/establishment";
import { establishmentService } from "@/service/superadmin/establishment";

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