"use client";

import { useState } from "react";
import { HeaderWrapper, MenuButton, MenuContainer } from "./styles";
import Menu from "../Menu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <HeaderWrapper>
        <h1>Finanças</h1>
        <MenuButton isOpen={isMenuOpen} onClick={toggleMenu}>
          ☰
        </MenuButton>
      </HeaderWrapper>
      {isMenuOpen && (
        <MenuContainer>
          <Menu setIsMenuOpen={setIsMenuOpen} />
        </MenuContainer>
      )}
    </>
  );
};

export default Header;
