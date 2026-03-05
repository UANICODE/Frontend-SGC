// app/layout.tsx
import { ClientOnly } from "@/ context/ClientOnly";
import "./globals.css";
import { ClientProviders } from "@/providers/ClientProviders";
import { ToastProvider } from "@/ context/ToastContext";


export const metadata = {
  title: "Meu App",
  description: "Exemplo App com Toasts",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <body>
        <ClientProviders>
          <ClientOnly>
            <ToastProvider>
              {children}
            </ToastProvider>
          </ClientOnly>
        </ClientProviders>
      </body>
    </html>
  );
}