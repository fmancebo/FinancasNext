"use client";

import React, { useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import { FaArrowCircleUp, FaArrowCircleDown, FaSearch } from "react-icons/fa";
import {
  PageWrapper,
  SearchWrapper,
  SearchInput,
  SortSelect,
  AccountWrapper,
  AccountDetails,
  ButtonGroup,
  DeleteButton,
  EditButton,
  TransactionType,
  SearchButton,
} from "./styles";

interface Conta {
  id: number;
  tipo: "entrada" | "saida";
  valor: number;
  descricao: string;
  forma: string;
  dataVencimento: string;
  status: string;
}

const Contas: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<string | null>(null);
  const [isAscending, setIsAscending] = useState(true);

  const contas: Conta[] = [
    {
      id: 1,
      tipo: "saida",
      valor: 500,
      descricao: "Aluguel",
      forma: "Débito",
      dataVencimento: "2024-10-01",
      status: "Pendente",
    },
    {
      id: 2,
      tipo: "entrada",
      valor: 300,
      descricao: "Salário",
      forma: "Crédito",
      dataVencimento: "2024-09-25",
      status: "Paga",
    },
    // Adicione mais contas aqui
  ];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSortOrder = e.target.value;

    // Se a nova ordenação for a mesma, inverte a direção
    if (newSortOrder === sortOrder) {
      setIsAscending((prev) => !prev);
    } else {
      setSortOrder(newSortOrder);
      setIsAscending(true); // Reseta para ascendente
    }
  };

  const filteredContas = contas
    .filter((conta) =>
      conta.descricao.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "vencimento-proximo") {
        return isAscending
          ? new Date(a.dataVencimento).getTime() -
              new Date(b.dataVencimento).getTime() // Próximo
          : new Date(b.dataVencimento).getTime() -
              new Date(a.dataVencimento).getTime(); // Distante
      }
      if (sortOrder === "vencimento-distante") {
        return isAscending
          ? new Date(b.dataVencimento).getTime() -
              new Date(a.dataVencimento).getTime() // Distante
          : new Date(a.dataVencimento).getTime() -
              new Date(b.dataVencimento).getTime(); // Próximo
      }
      if (sortOrder === "a-pagar") {
        return isAscending
          ? a.tipo === "entrada"
            ? 1
            : -1 // Saídas primeiro
          : a.tipo === "entrada"
          ? -1
          : 1; // Entradas primeiro
      }
      if (sortOrder === "a-receber") {
        return isAscending
          ? a.tipo === "saida"
            ? 1
            : -1 // Entradas primeiro
          : a.tipo === "saida"
          ? -1
          : 1; // Saídas primeiro
      }
      return 0; // Sem ordenação
    });

  return (
    <PageWrapper>
      {/* <h2>Suas Contas</h2> */}

      <SearchWrapper>
        <SearchInput
          type="text"
          placeholder="Buscar conta pelo nome..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <SearchButton>
          <FaSearch />
        </SearchButton>
      </SearchWrapper>

      <SortSelect value={sortOrder || ""} onChange={handleSortChange}>
        <option value="">Ordenar por</option>
        <option value="vencimento-proximo">Vencimento Próximo</option>
        <option value="vencimento-distante">Vencimento Distante</option>
        <option value="a-pagar">A Pagar</option>
        <option value="a-receber">A Receber</option>
      </SortSelect>

      {filteredContas.map((conta) => (
        <AccountWrapper key={conta.id}>
          <AccountDetails>
            <div>
              <h3>{conta.descricao}</h3>
              <p>
                {conta.valor} - {conta.forma}
              </p>
              <p>Vencimento: {conta.dataVencimento}</p>
              <p>Status: {conta.status}</p>
            </div>

            <TransactionType tipo={conta.tipo}>
              {conta.tipo === "entrada" ? (
                <>
                  <FaArrowCircleUp color="green" size={24} />
                  <span>A Receber</span>
                </>
              ) : (
                <>
                  <FaArrowCircleDown color="red" size={24} />
                  <span>A Pagar</span>
                </>
              )}
            </TransactionType>
          </AccountDetails>

          <ButtonGroup>
            <EditButton>
              <MdEdit size={20} />
            </EditButton>
            <DeleteButton>
              <MdDelete size={20} />
            </DeleteButton>
          </ButtonGroup>
        </AccountWrapper>
      ))}
    </PageWrapper>
  );
};

export default Contas;
