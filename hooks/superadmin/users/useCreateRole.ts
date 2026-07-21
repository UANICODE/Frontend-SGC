"use client";

import { useState } from "react";
import { createRole } from "@/service/superadmin/users/createRole";

export function useCreateRole() {
  const [loading, setLoading] = useState(false);

  async function execute(name: string) {
    try {
      setLoading(true);

      return await createRole({
        name,
      });
    } finally {
      setLoading(false);
    }
  }

  return {
    execute,
    loading,
  };
}