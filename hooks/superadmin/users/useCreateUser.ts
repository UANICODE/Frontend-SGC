"use client";

import { useState } from "react";
import { createUser } from "@/service/superadmin/users/createUser";
import { CreateUserRequest } from "@/types/superadmin/users/createUser";

export function useCreateUser() {
  const [loading, setLoading] = useState(false);

  async function execute(payload: CreateUserRequest) {
    try {
      setLoading(true);
      return await createUser(payload);
    } finally {
      setLoading(false);
    }
  }

  return {
    execute,
    loading,
  };
}