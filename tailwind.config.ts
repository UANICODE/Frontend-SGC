import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#F4511E",
        secondary: "#66BB6A",
        backgroundLight: "#FAFAFA",
        backgroundDark: "#121212",
        textPrimaryLight: "#212121",
        textPrimaryDark: "#FFFFFF",
        textSecondaryLight: "#757575",
        textSecondaryDark: "#BDBDBD",
        borderLight: "#BDBDBD",
        borderDark: "#333333",
        backgroundSkeleton: "#E1E9EE",
      },
    },
  },
  // Workaround para erro ao carregar o preflight.css no ambiente actual
  // Continua a gerar utilitários mas sem o reset de estilos base do Tailwind.
  corePlugins: {
    preflight: false,
  },
  plugins: [],
};

export default config;


