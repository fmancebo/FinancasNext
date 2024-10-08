"use client";

import { FaArrowCircleDown, FaArrowCircleUp } from "react-icons/fa";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import {
  Container,
  FormWrapper,
  Field,
  Label,
  Input,
  Select,
  RadioGroup,
  RadioButton,
  Button,
} from "./styles";
import { LoadingComponents, SpinnerComponents } from "../components/Loading";

const AddTransaction = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    valor: "",
    descricao: "",
    tipo: "entrada",
    forma: "debito",
    dataVencimento: "",
    parcelas: 1,
    status: "pendente",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!session?.user?.id) {
      console.error("Usuário não está autenticado");
      setError("Usuário não está autenticado");
      return;
    }

    console.log("Dados da transação:", formData);
    setLoading(true);
    try {
      const response = await fetch(`/api/accounts/${session.user.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Erro ao adicionar transação:", errorText);
        setError("Erro ao adicionar transação");
        return;
      }

      const data = await response.json();
      console.log("Transação adicionada com sucesso:", data);
      setSuccess("Transação adicionada com sucesso!");

      // Limpar os dados do formulário após o sucesso
      setFormData({
        valor: "",
        descricao: "",
        tipo: "entrada",
        forma: "debito",
        dataVencimento: "",
        parcelas: 1, // Resetar o número de parcelas
        status: "pendente",
      });
    } catch (error) {
      console.error("Erro ao enviar os dados:", error);
      setError("Erro ao adicionar transação");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <FormWrapper>
        <h2>Adicionar Transação</h2>

        <form onSubmit={handleSubmit}>
          <Field>
            <Label htmlFor="valor">Valor:</Label>
            <Input
              type="number"
              step="0.01"
              id="valor"
              name="valor"
              value={formData.valor}
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
              value={formData.descricao}
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
                  checked={formData.tipo === "entrada"}
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
                  checked={formData.tipo === "saida"}
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
              value={formData.forma}
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
              value={formData.dataVencimento}
              onChange={handleChange}
              required
            />
          </Field>

          <Field>
            <Label htmlFor="parcelas">Número de Parcelas:</Label>
            <Input
              type="number"
              id="parcelas"
              name="parcelas"
              value={formData.parcelas}
              onChange={handleChange}
              min="1"
              required
            />
          </Field>

          <Field>
            <Label htmlFor="status">Status:</Label>
            <Select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="pendente">Pendente</option>
              <option value="paga">Paga</option>
              <option value="vencida">Vencida</option>
            </Select>
          </Field>
          {loading ? (
            <LoadingComponents>
              <SpinnerComponents />
            </LoadingComponents>
          ) : (
            <Button type="submit">Adicionar Transação</Button>
          )}
          {success && (
            <p
              style={{ color: "green", textAlign: "center", marginTop: "5px" }}
            >
              {success}
            </p>
          )}
          {error && (
            <p style={{ color: "red", textAlign: "center" }}>{error}</p>
          )}
        </form>
      </FormWrapper>
    </Container>
  );
};

export default AddTransaction;
