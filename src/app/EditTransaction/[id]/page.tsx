"use client";

import React, { useEffect, useState } from "react";
import { FaArrowCircleDown, FaArrowCircleUp } from "react-icons/fa";
import {
  FormWrapper,
  Field,
  Label,
  Input,
  Select,
  RadioGroup,
  RadioButton,
  Button,
} from "../../AddTransaction/styles";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface EditTransactionProps {
  params: {
    id: string; // ID da transação
  };
}

const EditTransaction: React.FC<EditTransactionProps> = ({ params }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [transactionData, setTransactionData] = useState({
    valor: "",
    descricao: "",
    tipo: "",
    forma: "",
    dataVencimento: "",
    status: "",
    parcelas: "",
  });

  useEffect(() => {
    const fetchTransactionData = async () => {
      if (!session?.user?.id) {
        console.error("Usuário não autenticado");
        return;
      }

      const response = await fetch(
        `/api/accounts/${session.user.id}/${params.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setTransactionData({
          valor: data.valor || "",
          descricao: data.descricao || "",
          tipo: data.tipo || "",
          forma: data.forma || "",
          // Converte a data para o formato 'YYYY-MM-DD' subtraindo um dia
          dataVencimento: data.dataVencimento
            ? (() => {
                const date = new Date(data.dataVencimento);
                date.setDate(date.getDate() - 1); // Subtrai um dia
                return date.toISOString().slice(0, 10); // Formata a data
              })()
            : "",
          status: data.status || "",
          parcelas: data.parcelas || "",
        });
      } else {
        console.error("Falha ao buscar dados da transação");
      }
    };

    fetchTransactionData();
  }, [params.id, session]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setTransactionData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!session?.user?.id) {
      console.error("Usuário não autenticado");
      return;
    }

    const response = await fetch(
      `/api/accounts/${session.user.id}/${params.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transactionData),
      }
    );

    if (response.ok) {
      console.log("Transação atualizada com sucesso");
      setSuccess("Transação atualizada com sucesso!");
      setTimeout(() => {
        router.push("/Count"); // Use router.push para redirecionar
      }, 1000);
    } else {
      console.error("Falha ao atualizar a transação");
      setError("Erro ao atualizar transação");
    }
  };

  return (
    <FormWrapper>
      <h2>Editar Transação</h2>

      <form onSubmit={handleSubmit}>
        <Field>
          <Label htmlFor="valor">Valor:</Label>
          <Input
            type="number"
            step="0.01"
            id="valor"
            name="valor"
            value={transactionData.valor}
            onChange={handleChange}
            required
          />
        </Field>

        <Field>
          <Label htmlFor="descricao">Descrição:</Label>
          <Input
            type="text"
            id="descricao"
            name="descricao"
            value={transactionData.descricao}
            onChange={handleChange}
            required
          />
        </Field>

        <Field>
          <Label>Tipo de Transação:</Label>
          <RadioGroup>
            <RadioButton>
              <Input
                type="radio"
                id="entrada"
                name="tipo"
                value="entrada"
                checked={transactionData.tipo === "entrada"}
                onChange={handleChange}
              />
              <Label htmlFor="entrada">Entrada</Label>
              <FaArrowCircleUp
                color="green"
                size={36}
                style={{ marginLeft: "10px" }}
              />
            </RadioButton>
            <RadioButton>
              <Input
                type="radio"
                id="saida"
                name="tipo"
                value="saida"
                checked={transactionData.tipo === "saida"}
                onChange={handleChange}
              />
              <Label htmlFor="saida">Saída</Label>
              <FaArrowCircleDown
                color="red"
                size={36}
                style={{ marginLeft: "10px" }}
              />
            </RadioButton>
          </RadioGroup>
        </Field>

        <Field>
          <Label htmlFor="forma">Forma de Pagamento:</Label>
          <Select
            id="forma"
            name="forma"
            value={transactionData.forma}
            onChange={handleChange}
            required
          >
            <option value="debito">Débito</option>
            <option value="credito">Crédito</option>
            <option value="outro">Outro</option>
          </Select>
        </Field>

        <Field>
          <Label htmlFor="dataVencimento">Data de Vencimento:</Label>
          <Input
            type="date"
            id="dataVencimento"
            name="dataVencimento"
            value={transactionData.dataVencimento}
            onChange={handleChange}
            required
          />
        </Field>

        <Field>
          <Label htmlFor="status">Status:</Label>
          <Select
            id="status"
            name="status"
            value={transactionData.status}
            onChange={handleChange}
          >
            <option value="pendente">Pendente</option>
            <option value="paga">Paga</option>
            <option value="vencida">Vencida</option>
          </Select>
        </Field>

        <Button type="submit">Atualizar Transação</Button>
      </form>
      {success && (
        <p style={{ color: "green", textAlign: "center", marginTop: "10px" }}>
          {success}
        </p>
      )}
      {error && (
        <p style={{ color: "red", textAlign: "center", marginTop: "10px" }}>
          {error}
        </p>
      )}
    </FormWrapper>
  );
};

export default EditTransaction;