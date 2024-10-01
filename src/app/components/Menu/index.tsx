import { signOut } from "next-auth/react";
import Link from "next/link";
import { MenuWrapper, MenuItem, LogoutButton } from "./styles";

interface MenuProps {
  setIsMenuOpen: (isOpen: boolean) => void; // Adiciona a prop
}

const Menu = ({ setIsMenuOpen }: MenuProps) => {
  const handleSignOut = () => {
    signOut({ callbackUrl: "/api/auth/signin" });
    setIsMenuOpen(false); // Fecha o menu após o sign-out
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false); // Fecha o menu ao clicar em um link
  };

  return (
    <MenuWrapper>
      <Link href="/DashBoard">
        <MenuItem onClick={handleLinkClick}>Dashboard</MenuItem>
      </Link>
      <Link href="/Count">
        <MenuItem onClick={handleLinkClick}>Contas</MenuItem>
      </Link>
      <Link href="/AddTransaction">
        <MenuItem onClick={handleLinkClick}>Adicionar Conta</MenuItem>
      </Link>
      <LogoutButton onClick={handleSignOut}>Sair</LogoutButton>
    </MenuWrapper>
  );
};

export default Menu;
