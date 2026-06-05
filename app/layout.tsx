// app/layout.tsx
import { ClientOnly } from "@/ context/ClientOnly";
import "./globals.css";
import { ClientProviders } from "@/providers/ClientProviders";

export const metadata = {
  title: "SGC",

};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <body>
        {/* Todos os providers e toasts ficam aqui */}
        <ClientProviders>
          <ClientOnly>
            {children}
          </ClientOnly>
        </ClientProviders>
        
      </body>
    </html>
  );
}