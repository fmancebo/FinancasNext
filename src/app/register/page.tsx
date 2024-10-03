"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import {
  BodyLogin,
  Container,
  BoxLogin,
  LoginHeader,
  InputBox,
  InputField,
  Label,
  BtnLogin,
} from "./styles";
import { LoadingComponents, SpinnerComponents } from "./styles";
import "@fortawesome/fontawesome-free/css/all.min.css";

function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState<string | null>(null);

  // Especifica o tipo do evento
  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Previne o comportamento padrão do formulário
    setLoading(true); // Ativa o estado de carregamento
    setErrorMessage(""); // Limpa mensagens de erro

    const userData = { name, email, password };

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        setErrorMessage(errorResponse.message || "Erro ao cadastrar usuário");
      } else {
        // Sucesso: redirecione ou mostre uma mensagem de sucesso
        console.log("Usuário cadastrado com sucesso!");
        setSuccess("Usuário cadastrado com sucesso!");
        setTimeout(() => {
          router.push("/Count"); // Use router.push para redirecionar
        }, 1000);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setErrorMessage("Erro de rede. Tente novamente mais tarde.");
    } finally {
      setLoading(false); // Desativa o estado de carregamento
    }
  };

  return (
    <BodyLogin>
      <Container>
        <BoxLogin>
          <LoginHeader>
            <span>Registrar</span>
          </LoginHeader>
          <form onSubmit={handleRegister}>
            <InputBox>
              <InputField
                type="text"
                id="fullName"
                name="fullName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Label className="label" htmlFor="fullName">
                Nome e sobrenome
              </Label>
              <i className="fa-regular fa-user" />
            </InputBox>
            <InputBox>
              <InputField
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Label className="label" htmlFor="email">
                Email
              </Label>
              <i className="fa-regular fa-envelope" />
            </InputBox>
            <InputBox>
              <InputField
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Label className="label" htmlFor="password">
                Password
              </Label>
              <i className="fa-solid fa-lock" />
            </InputBox>
            {loading ? (
              <LoadingComponents>
                <SpinnerComponents />
              </LoadingComponents>
            ) : (
              <BtnLogin type="submit">Cadastrar</BtnLogin>
            )}
            {success && (
              <div
                style={{
                  color: "green",
                  fontWeight: "bold",
                  marginTop: "10px",
                  textAlign: "center",
                }}
              >
                {success}
              </div>
            )}
            {errorMessage && (
              <div
                style={{
                  color: "red",
                  fontWeight: "bold",
                  marginTop: "10px",
                  textAlign: "center",
                }}
              >
                {errorMessage}
              </div>
            )}
          </form>
        </BoxLogin>
      </Container>
    </BodyLogin>
  );
}

export default RegisterPage;
