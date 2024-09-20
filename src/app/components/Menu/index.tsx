// src/app/components/Menu/index.tsx
import { signOut } from "next-auth/react";
import Link from "next/link";
import { MenuWrapper, MenuItem, LogoutButton } from "./styles";

const Menu = () => {
  const handleSignOut = () => {
    // Chama o método signOut do NextAuth
    signOut({ callbackUrl: "/api/auth/signin" }); // Redireciona para a página inicial após o sign-out
  };

  return (
    <MenuWrapper>
      <MenuItem>Dashboard</MenuItem>
      <MenuItem>Contas</MenuItem>
      <MenuItem>
        <Link href="/AddTransaction">Adicionar Conta</Link>
      </MenuItem>
      <LogoutButton onClick={handleSignOut}>Sair</LogoutButton>
    </MenuWrapper>
  );
};

export default Menu;
