import { NextRequest, NextResponse } from "next/server";
import db from "../../../../../database";
import {
  showAccount,
  updateAccount,
  deleteAccount,
} from "../../../../../controllers/accountController";

// Tipos específicos para os dados da requisição
interface UpdateAccountData {
  valor?: number;
  tipo?: string;
  forma?: string;
  dataVencimento?: string;
  status?: string;
}

// Função para manipular a solicitação e chamar o controlador
async function handleRequest<T>(
  handler: (
    userId: string,
    accountId: string,
    data?: UpdateAccountData
  ) => Promise<T>,
  req: NextRequest
): Promise<NextResponse> {
  try {
    await db.connect(); // Conectar ao banco de dados

    // Extrair userId e accountId da URL
    const pathname = req.nextUrl.pathname;
    const segments = pathname.split("/");
    const userId = segments[segments.length - 2];
    const accountId = segments[segments.length - 1];

    if (typeof userId !== "string" || typeof accountId !== "string") {
      throw new Error("Invalid parameters");
    }

    // Obter os dados da requisição, se houver
    const data = req.method === "PATCH" ? await req.json() : undefined;

    const result = await handler(userId, accountId, data as UpdateAccountData);
    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("Error handling request:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Função para mostrar uma conta específica de um usuário
export async function GET(req: NextRequest) {
  return handleRequest(showAccount, req);
}

// Função para atualizar parcialmente uma conta existente
export async function PATCH(req: NextRequest) {
  return handleRequest(updateAccount, req);
}

// Função para excluir uma conta
export async function DELETE(req: NextRequest) {
  return handleRequest(deleteAccount, req);
}
