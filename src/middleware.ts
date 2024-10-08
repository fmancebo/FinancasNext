import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  // Obtém o token JWT
  const token = await getToken({ req, secret: process.env.JWT_SECRET });

  // Se o token não existir, redireciona para a página de login
  if (!token) {
    return NextResponse.redirect(new URL("/api/auth/signin", req.url));
  }

  // Verifica se o token possui a propriedade 'exp' e se é um número
  const exp = token.exp as number | undefined;

  // Se o exp existir e for um número, verificar se o token está expirado
  const isTokenExpired = exp ? Date.now() >= exp * 1000 : false;

  // Se o token estiver expirado, redireciona para a página de login
  if (isTokenExpired) {
    return NextResponse.redirect(new URL("/api/auth/signin", req.url));
  }

  // Permite o acesso se o token for válido
  return NextResponse.next();
}

// Define as rotas que o middleware deve proteger
export const config = {
  matcher: ["/Dashboard", "/Count", "/AddTransaction", "/EditTransaction"],
};
