"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { ChartContainer, ChartWrapper } from "./styles";

// Registre os componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Definindo as cores para "Entrada", "Saída" e "Disponível"
const colors = {
  entrada: "#8884d8", // Roxo
  saida: "#ffc658", // Amarelo
  disponivel: "#82ca9d", // Verde
};

// Opções para os gráficos
const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false, // Desativa a legenda
    },
    tooltip: {
      mode: "index" as const,
      intersect: false,
    },
  },
  scales: {
    x: {
      title: {
        display: false, // Desativa o título do eixo x
      },
    },
    y: {
      title: {
        display: false, // Desativa o título do eixo y
      },
    },
  },
};

const MyBarChart = () => {
  const { data: session } = useSession();
  const [contas, setContas] = useState<Conta[]>([]);

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

  // Função para buscar as contas
  const fetchContas = useCallback(async () => {
    if (!session?.user?.id) {
      console.error("Usuário não autenticado");
      return;
    }

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
    }
  }, [session]);

  useEffect(() => {
    fetchContas();
  }, [fetchContas]);

  // Calculando os dados dos gráficos com base nas contas
  const calculateData = () => {
    const entrada = contas
      .filter(
        (conta) =>
          conta.tipo === "entrada" &&
          conta.forma === "debito" &&
          conta.status === "paga"
      )
      .reduce((acc, conta) => acc + conta.valor, 0);

    const saida = contas
      .filter((conta) => conta.tipo === "saida" && conta.forma === "debito")
      .reduce((acc, conta) => acc + conta.valor, 0);

    const disponivel = entrada - saida;

    // Calcular os dados para "outros"
    const outrosEntrada = contas
      .filter(
        (conta) =>
          conta.tipo === "entrada" &&
          conta.forma === "outro" &&
          conta.status === "paga"
      )
      .reduce((acc, conta) => acc + conta.valor, 0);

    const outrosSaida = contas
      .filter((conta) => conta.tipo === "saida" && conta.forma === "outro")
      .reduce((acc, conta) => acc + conta.valor, 0);

    const outrosDisponivel = outrosEntrada - outrosSaida;

    return {
      debitData: {
        labels: ["Entrada", "Saída", "Disponível"],
        datasets: [
          {
            label: "Débito",
            data: [entrada, saida, disponivel],
            backgroundColor: [colors.entrada, colors.saida, colors.disponivel],
          },
        ],
      },
      creditData: {
        labels: ["Entrada", "Saída", "Disponível"],
        datasets: [
          {
            label: "Crédito",
            data: [4000, 3000, 2000], // Mantendo os dados de exemplo
            backgroundColor: [colors.entrada, colors.saida, colors.disponivel],
          },
        ],
      },
      otherData: {
        labels: ["Entrada", "Saída", "Disponível"],
        datasets: [
          {
            label: "Outros",
            data: [outrosEntrada, outrosSaida, outrosDisponivel], // Dados atualizados
            backgroundColor: [colors.entrada, colors.saida, colors.disponivel],
          },
        ],
      },
    };
  };

  const { debitData, creditData, otherData } = calculateData();

  return (
    <ChartContainer>
      <h2>DashBoard</h2>
      <ChartWrapper>
        <h3>Débito</h3>
        <Bar data={debitData} options={options} />
      </ChartWrapper>
      <ChartWrapper>
        <h3>Crédito</h3>
        <Bar data={creditData} options={options} />
      </ChartWrapper>
      <ChartWrapper>
        <h3>Outros</h3>
        <Bar data={otherData} options={options} />
      </ChartWrapper>
    </ChartContainer>
  );
};

export default MyBarChart;
