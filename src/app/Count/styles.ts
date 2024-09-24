import styled from "styled-components";

interface TransactionTypeProps {
  tipo: "entrada" | "saida"; // Definindo os tipos permitidos
}

// Wrapper da página principal
export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  max-width: 600px; // Ajustando para ter uma largura máxima
  padding: 5px;
  padding-top: 3px;
  background-color: #f7f7f7;
  margin: 0 auto; // Centralizando na tela
`;

// Estilo para o wrapper da busca
export const SearchWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 600px;
  margin-bottom: 20px;
`;

// Estilo do campo de busca
export const SearchInput = styled.input`
  width: 100%; // Ajustando para ocupar a largura total
  padding: 10px 40px 10px 10px; // Ajustando padding para dar espaço ao botão
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

// Estilo do botão de busca (agora como um botão dentro do input)
export const SearchButton = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: #007bff;
  font-size: 20px;

  &:hover {
    color: #0056b3;
  }
`;

// Estilo do seletor de ordenação
export const SortSelect = styled.select`
  width: 150px; /* Ajuste a largura conforme necessário */
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  background-color: #004d1a;
  color: white;
  font-weight: 500;
  cursor: pointer;

  &:focus {
    outline: none;
  }

  option {
    background-color: #004d1a;
    color: white;
    font-size: 13px;
  }

  /* Para evitar o foco no estilo padrão */
  &:focus-visible {
    outline: none;
  }

  /* Efeito de hover nas opções */
  &:hover {
    background-color: #00532d; /* Cor de fundo ao passar o mouse */
  }
`;

// Wrapper para cada conta
export const AccountWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

// Estilo para os detalhes da conta
export const AccountDetails = styled.div`
  display: flex;
  flex-direction: column;

  h3 {
    font-size: 1.3rem;
    margin: 0 0 5px;
    color: black;
    font-weight: bold;
  }

  p {
    margin: 3px 0;
    font-size: 1rem;
    color: black;
    font-weight: 500;
  }

  span {
    font-weight: bold;
    color: black;
  }
`;

// Botões de editar e excluir
export const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

export const EditButton = styled.button`
  background-color: #e7f1ff;
  border: 1px solid #007bff;
  border-radius: 5px;
  cursor: pointer;
  color: #007bff;
  font-size: 16px;
  padding: 5px 10px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #007bff;
    color: white;
  }
`;

export const DeleteButton = styled.button`
  background-color: #ffe5e5;
  border: 1px solid #ff4d4f;
  border-radius: 5px;
  cursor: pointer;
  color: #ff4d4f;
  font-size: 16px;
  padding: 5px 10px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #ff4d4f;
  }
`;

// Estilo do ícone e texto para o tipo de transação
export const TransactionType = styled.div<TransactionTypeProps>`
  display: flex;
  margin-top: 10px;
  align-items: center;
  font-size: 16px;
  color: ${(props) => (props.tipo === "entrada" ? "green" : "red")};

  span {
    margin-left: 10px;
    font-weight: bold;
    font-size: 16px;
  }
`;
