import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",       // detecta arquivos no app
    "./components/**/*.{ts,tsx}",// detecta arquivos em components
  ],
  theme: {
    extend: {
      colors: {
        /* ===== SISTEMA FIXO ===== */
        backgroundLight: "#FAFAFA",
        backgroundDark: "#121212",

        textPrimaryLight: "#212121",
        textPrimaryDark: "#FFFFFF",

        textSecondaryLight: "#757575",
        textSecondaryDark: "#BDBDBD",

        borderLight: "#E5E7EB",
        borderDark: "#2A2A2A",

        backgroundSkeleton: "#E1E9EE",

        /* ===== DINÂMICAS (POR ESTABELECIMENTO) ===== */
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
      },
    },
  },
  plugins: [],
};

export default config;