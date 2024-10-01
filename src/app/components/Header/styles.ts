import styled, { keyframes, css } from "styled-components";

// Animação de rotação para o botão do menu
const rotateButton = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(90deg);
  }
`;

// Define a animação condicional usando o helper css
const rotateAnimation = css`
  animation: ${rotateButton} 0.3s forwards;
`;

export const HeaderWrapper = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  height: 50px;
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  background-color: #004d1a;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const MenuButton = styled.button.withConfig({
  // Evita que a prop `isOpen` seja passada para o DOM
  shouldForwardProp: (prop) => prop !== "isOpen",
})<{ isOpen: boolean }>`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  transition: transform 0.3s ease;

  // Aplica a rotação quando o menu está aberto
  ${(props) => props.isOpen && rotateAnimation}
`;

export const MenuContainer = styled.div`
  position: absolute;
  top: 60px;
  right: 10px;
  background-color: #f8f8f8;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  z-index: 1000;
`;
