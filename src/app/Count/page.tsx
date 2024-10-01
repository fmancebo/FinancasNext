"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { MdDelete, MdEdit } from "react-icons/md";
import { FaArrowCircleUp, FaArrowCircleDown, FaSearch } from "react-icons/fa";
import { Loading, Spinner } from "../components/Loading";
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
  _id: string;
  tipo: "entrada" | "saida";
  valor: number;
  descricao: string;
  forma: "debito" | "credito" | "outro";
  dataVencimento: string;
  status: string;
  parcelas: number;
}

const Contas: React.FC = () => {
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<string | null>(null);
  const [isAscending, setIsAscending] = useState(true);
  const [loading, setLoading] = useState(false);

  const [contas, setContas] = useState<Conta[]>([]); // Estado para armazenar as contas

  const formatarStatus = (status: string) => {
    switch (status) {
      case "pendente":
        return "Pendente";
      case "pago":
        return "Pago";
      case "vencido":
        return "Vencido";
      default:
        return status; // Retorna o status original se não houver formatação
    }
  };

  const formatarForma = (forma: "debito" | "credito" | "outro") => {
    switch (forma) {
      case "debito":
        return "Débito";
      case "credito":
        return "Crédito";
      case "outro":
        return "Outro";
      default:
        return forma; // Retorna a forma original caso não seja uma das opções
    }
  };

  // Função para buscar as contas
  const fetchContas = useCallback(async () => {
    if (!session?.user?.id) {
      console.error("Usuário não autenticado");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`/api/accounts/${session.user.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar contas");
      }

      const data: Conta[] = await response.json();

      // Transformar o _id em id
      const contasComId = data.map((conta) => ({
        ...conta,
        id: conta._id, // Substitui _id por id
      }));

      setContas(contasComId);
    } catch (error) {
      console.error("Erro ao buscar contas:", error);
    } finally {
      setLoading(false); // Finaliza o carregamento
    }
  }, [session]);

  useEffect(() => {
    fetchContas();
  }, [fetchContas]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSortOrder = e.target.value;
    if (newSortOrder === sortOrder) {
      setIsAscending((prev) => !prev);
    } else {
      setSortOrder(newSortOrder);
      setIsAscending(true);
    }
  };

  const handleDelete = async (id: Conta["_id"]) => {
    if (!session?.user?.id) {
      console.error("Usuário não autenticado");
      return;
    }
    setLoading(true);
    console.log("userId:", session.user.id);
    console.log("accountId:", id);

    try {
      const response = await fetch(`/api/accounts/${session.user.id}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erro ao deletar conta:", errorData);
        throw new Error(
          `Erro ao deletar conta: ${errorData.message || "Erro desconhecido"}`
        );
      }

      console.log("Conta deletada com sucesso.");
      setContas((prevContas) => prevContas.filter((conta) => conta._id !== id));
    } catch (error) {
      console.error("Erro ao deletar conta:", error);
    } finally {
      setLoading(false); // Finaliza o carregamento
    }
  };

  const filteredContas = contas
    .filter(
      (conta) =>
        conta.descricao &&
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
      {loading ? (
        <Loading>
          <Spinner />
        </Loading>
      ) : (
        <>
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
            <AccountWrapper key={conta._id}>
              <AccountDetails>
                <div>
                  <h3>{conta.descricao}</h3>
                  <p>
                    <span>
                      R${" "}
                      {conta.valor.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      - {formatarForma(conta.forma)}
                    </span>
                  </p>
                  <p>
                    Vencimento:{" "}
                    <span>
                      {new Date(conta.dataVencimento).toLocaleDateString(
                        "pt-BR"
                      )}
                    </span>
                  </p>
                  <p>
                    Status: <span>{formatarStatus(conta.status)}</span>
                  </p>
                  <p>
                    Parcela: <span>{conta.parcelas}</span>
                  </p>
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
                <Link href={`/EditTransaction/${conta._id}`}>
                  <EditButton>
                    <MdEdit size={20} />
                  </EditButton>
                </Link>
                <DeleteButton onClick={() => handleDelete(conta._id)}>
                  <MdDelete size={20} />
                </DeleteButton>
              </ButtonGroup>
            </AccountWrapper>
          ))}
        </>
      )}
    </PageWrapper>
  );
};

export default Contas;
