"use client";

import { getLoggedEstablishment } from "@/service/auth/logged-establishment";
import { LoggedEstablishmentResponse } from "@/types/auth/LoggedEstablishmentResponse";
import { useEffect, useState } from "react";


export function useLoggedEstablishment(establishmentId: string) {
  const [data, setData] = useState<LoggedEstablishmentResponse| null>(null);

  useEffect(() => {
    getLoggedEstablishment(establishmentId).then(setData);
  }, [establishmentId]);

  return { data };
}