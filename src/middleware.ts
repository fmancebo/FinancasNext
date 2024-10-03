import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  // Obtém o token JWT
  const token = await getToken({ req, secret: process.env.JWT_SECRET });

  // Se o token não existir, redireciona para a página de login
  if (!token) {
    return NextResponse.redirect(new URL("/api/auth/signin", req.url));
  }

  // Permite o acesso se o token existir
  return NextResponse.next();
}

// Define as rotas que o middleware deve proteger
export const config = {
  matcher: ["/DashBoard", "/Count", "/AddTransaction", "/EditTransaction"],
};
