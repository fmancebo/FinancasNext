"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";

export default function ClientSideHeaderWrapper() {
  const pathname = usePathname();

  // Defina as rotas nas quais você não quer exibir o header
  const noHeaderRoutes = ["/api/auth/signin", "/register"];

  // Se a rota atual estiver nas rotas definidas, o Header não será exibido
  if (noHeaderRoutes.includes(pathname)) {
    return null;
  }

  return <Header />;
}
