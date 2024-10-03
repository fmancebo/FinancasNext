"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useForm, SubmitHandler } from "react-hook-form";
import Link from "next/link";
import {
  BodyLogin,
  Container,
  BoxLogin,
  LoginHeader,
  InputBox,
  InputField,
  Label,
  BtnLogin,
  BoxRegister,
  AuthSeparator,
  GoogleLoginButton,
} from "./styles";
import {
  LoadingComponents,
  SpinnerComponents,
} from "../../../components/Loading";
import "@fortawesome/fontawesome-free/css/all.min.css";

type Inputs = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [signInCredentialsError, setSignInCredentialsError] =
    useState<boolean>(false);
  const [error, setError] = useState<string | null>(null); // Mantendo a variável error

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const GoogleSubmit = async () => {
    setLoading(true);
    try {
      await signIn("google", {
        redirect: true,
        callbackUrl: "/",
      });
    } catch (error) {
      console.error("Google login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const CredentialsSubmit: SubmitHandler<Inputs> = async (data) => {
    setLoading(true); // Inicia o carregamento
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: true,
      callbackUrl: "/",
    });

    setLoading(false); // Para o carregamento

    if (result?.error) {
      setSignInCredentialsError(true);
      setError(result.error); // Define a mensagem de erro
    } else {
      setError(null); // Limpa o erro caso o login seja bem-sucedido
    }
  };

  return (
    <BodyLogin>
      <Container>
        <BoxLogin>
          <LoginHeader>
            <span>Login</span>
          </LoginHeader>
          <GoogleLoginButton type="button" onClick={GoogleSubmit}>
            <i className="fa-brands fa-google" style={{ color: "green" }} />
            Entrar com Google
          </GoogleLoginButton>

          <AuthSeparator>
            <div className="line"></div>
            <span>OR</span>
            <div className="line"></div>
          </AuthSeparator>

          <form onSubmit={handleSubmit(CredentialsSubmit)}>
            <InputBox>
              <InputField
                type="email"
                id="email"
                {...register("email", { required: "Email é obrigatório" })}
                required
              />
              <Label className="label" htmlFor="email">
                Email
              </Label>
              <i className="fa-regular fa-envelope" />
              {errors.email && ( // Mostra erro para o campo email
                <span style={{ color: "red", fontSize: "12px" }}>
                  {errors.email.message}
                </span>
              )}
            </InputBox>

            <InputBox>
              <InputField
                type="password"
                id="password"
                {...register("password", { required: "Senha é obrigatória" })}
                required
              />
              <Label className="label" htmlFor="password">
                Password
              </Label>
              <i className="fa-solid fa-lock" />
              {errors.password && ( // Mostra erro para o campo password
                <span style={{ color: "red", fontSize: "12px" }}>
                  {errors.password.message}
                </span>
              )}
            </InputBox>

            {loading ? (
              <LoadingComponents>
                <SpinnerComponents />
              </LoadingComponents>
            ) : (
              <BtnLogin type="submit">Login</BtnLogin>
            )}

            {signInCredentialsError && (
              <div
                style={{
                  color: "red",
                  fontWeight: "bold",
                  marginTop: "10px",
                  textAlign: "center",
                }}
              >
                Credenciais inválidas. Por favor, tente novamente.
              </div>
            )}

            {error && ( // Exibe mensagem de erro se houver
              <div
                style={{
                  color: "red",
                  fontWeight: "bold",
                  marginTop: "10px",
                  textAlign: "center",
                }}
              >
                {error}
              </div>
            )}
          </form>

          <BoxRegister>
            <span>Não tem cadastro? </span>
            <Link href="/register">Registrar</Link>
          </BoxRegister>
        </BoxLogin>
      </Container>
    </BodyLogin>
  );
}
