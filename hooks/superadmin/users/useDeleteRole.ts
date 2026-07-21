"use client";

import { useState } from "react";
import { deleteRole } from "@/service/superadmin/users/deleteRole";

export function useDeleteRole() {
  const [loading, setLoading] = useState(false);

  async function execute(roleId: number) {
    try {
      setLoading(true);

      return await deleteRole(roleId);
    } finally {
      setLoading(false);
    }
  }

  return {
    execute,
    loading,
  };
}