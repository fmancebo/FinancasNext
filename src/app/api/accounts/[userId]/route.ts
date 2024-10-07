import { NextRequest, NextResponse } from "next/server";
import db from "../../../../database";
import {
  getAccounts,
  createAccount,
} from "../../../../controllers/accountController";

// Tipos específicos para os dados da requisição
interface AccountRequestData {
  valor?: number;
  descricao?: string;
  tipo?: string;
  forma?: string;
  dataVencimento?: Date;
  status?: string;
  parcelas?: number;
}

// Função para manipular a solicitação e chamar o controlador
async function handleRequest<T>(
  handler: (userId: string, data: AccountRequestData) => Promise<T>, // Remova o '?' aqui
  req: NextRequest
): Promise<NextResponse> {
  try {
    await db.connect(); // Conectar ao banco de dados

    // Extrair userId da URL
    const userId = req.nextUrl.pathname.split("/").pop() as string;

    if (typeof userId !== "string") {
      throw new Error("Invalid parameters");
    }

    // Extrair dados do corpo da requisição
    const data: AccountRequestData =
      req.method === "POST" ? await req.json() : {}; // Mude 'undefined' para um objeto vazio

    // Adicionar userId à chamada do controlador
    const result = await handler(userId, data);
    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("Error handling request:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Função para listar todas as contas de um usuário específico
export async function GET(req: NextRequest) {
  return handleRequest(getAccounts, req);
}

// Função para criar uma nova conta
export async function POST(req: NextRequest) {
  return handleRequest(createAccount, req);
}
