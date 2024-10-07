import type { Metadata } from "next";
import "./globals.css";
import SessionProviderWrapper from "./components/SessionProviderWrapper";
import ClientSideHeaderWrapper from "./components/ClientSideHeaderWrapper";
// import Header from "./components/Header";

export const metadata: Metadata = {
  title: "Finanças",
  description: "Controle de Finanças",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#f5f5f5" />
      </head>
      <body className="antialiased">
        <SessionProviderWrapper>
          <ClientSideHeaderWrapper />
          {children}
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
