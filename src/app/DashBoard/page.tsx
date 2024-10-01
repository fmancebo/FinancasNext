"use client";

import React from "react";
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

// Dados para os gráficos
const creditData = {
  labels: ["Entrada", "Saída", "Disponível"],
  datasets: [
    {
      label: "Crédito",
      data: [4000, 3000, 2000],
      backgroundColor: [colors.entrada, colors.saida, colors.disponivel],
    },
  ],
};

const debitData = {
  labels: ["Entrada", "Saída", "Disponível"],
  datasets: [
    {
      label: "Débito",
      data: [2400, 1398, 9800],
      backgroundColor: [colors.entrada, colors.saida, colors.disponivel],
    },
  ],
};

const otherData = {
  labels: ["Entrada", "Saída", "Disponível"],
  datasets: [
    {
      label: "Outros",
      data: [2400, 2210, 2290],
      backgroundColor: [colors.entrada, colors.saida, colors.disponivel],
    },
  ],
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
