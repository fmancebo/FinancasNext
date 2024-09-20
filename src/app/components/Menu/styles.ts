// src/app/components/Menu/styles.ts
import styled from "styled-components";

export const MenuWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #004d1a;
  color: white;
  font-weight: 500;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const MenuItem = styled.div`
  padding: 10px;
  cursor: pointer;
  &:hover {
    background-color: #00532d;
  }
`;

export const LogoutButton = styled(MenuItem)`
  margin-top: auto;
  color: red;
`;
