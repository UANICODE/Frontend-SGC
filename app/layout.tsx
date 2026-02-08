import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Foodnect Decide onde comer em segundos | Beira, Moçambique",
  description:
    "Com fome e sem paciência? A Foodnect mostra restaurantes reais perto de ti na Beira, Moçambique, com cardápios, preços e pedidos em tempo real.",
  icons: {
    icon: [
      { url: "/images/logo5.png", type: "image/png" },
    ],
    apple: [
      { url: "/images/logo5.png", type: "image/png" },
    ],
    shortcut: "/images/logo5.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt" className="light">
      <head>
        {/* Meta tag para forçar light mode no Android */}
        <meta
          name="color-scheme"
          content="light only"
        />
        <meta
          name="theme-color"
          content="#fafafa"
          media="(prefers-color-scheme: light)"
        />
      </head>
      <body className="min-h-screen bg-backgroundLight text-textPrimaryLight light-mode">
        <Navbar />
        <main className="pt-20">{children}</main>
        <Footer />
      </body>
    </html>
  );
}



