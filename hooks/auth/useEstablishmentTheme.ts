"use client";

import { useEffect } from "react";

export function useEstablishmentTheme(
  primary?: string,
  secondary?: string
) {
  useEffect(() => {
    if (!primary || !secondary) return;

    document.documentElement.style.setProperty(
      "--color-primary",
      primary
    );

    document.documentElement.style.setProperty(
      "--color-secondary",
      secondary
    );
  }, [primary, secondary]);
}