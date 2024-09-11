import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import User from "./models/User";
import db from "./database";

export async function middleware(req: NextRequest) {
  try {
    // Obtém o token JWT
    const token = await getToken({ req, secret: process.env.JWT_SECRET });

    // Se o token não existir, redireciona para a página de login
    if (!token) {
      return NextResponse.redirect(new URL("/api/auth/signin", req.url));
    }

    const { pathname } = req.nextUrl;

    // Verifica se o usuário está tentando acessar um recurso específico (neste caso, um usuário)
    if (pathname.startsWith("/api/users")) {
      await db.connect(); // Conecta ao banco de dados

      // Extrai o ID do usuário da URL (/api/users/:id)
      const userId = pathname.split("/").pop();

      // Busca o usuário no banco de dados
      const user = await User.findById(userId);

      // Se o usuário não for encontrado, retorna erro de recurso não encontrado
      if (!user) {
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      }

      // Verifica se o usuário logado é o dono do recurso ou se é admin
      const isOwner = token.id === user._id.toString();
      const isAdmin = token.isAdmin;

      if (isOwner || isAdmin) {
        return NextResponse.next(); // Permite o acesso
      } else {
        return NextResponse.redirect(new URL("/unauthorized", req.url)); // Redireciona se não tiver permissão
      }
    }

    return NextResponse.next(); // Permite o acesso a outras rotas ou recursos não protegidos
  } catch (error) {
    console.error("Error in middleware:", error);
    return NextResponse.redirect(new URL("/error", req.url)); // Redireciona para uma página de erro
  }
}

export const config = {
  matcher: ["/api/users/:path*", "/api/accounts/:path*"], // Aplica o middleware às rotas de usuários e contas
};
