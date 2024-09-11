import { NextRequest, NextResponse } from "next/server";
import db from "../../../database";
import { getUsers, createUser } from "../../../controllers/userController";

// Defina tipos específicos para os dados da requisição
type CreateUserData = {
  name: string;
  email: string;
  password: string;
  secretAdmin?: string;
};

// Função para manipular a solicitação e chamar o controlador
async function handleRequest<T>(
  handler: (data: CreateUserData) => Promise<T>,
  req: NextRequest
): Promise<NextResponse> {
  try {
    await db.connect(); // Conectar ao banco de dados

    let data: CreateUserData | undefined;
    if (req.method === "POST") {
      data = await req.json();
      if (
        data === undefined ||
        typeof data !== "object" ||
        !("name" in data && "email" in data && "password" in data)
      ) {
        return NextResponse.json(
          { message: "Invalid data provided" },
          { status: 400 }
        );
      }
    }

    // Garantir que data não é undefined
    const result = await handler(data as CreateUserData);
    return NextResponse.json(result);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error handling request:", error.message);
      return NextResponse.json({ message: error.message }, { status: 400 });
    } else {
      console.error("Unknown error:", error);
      return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
}

// Função para listar todos os usuários
export async function GET(req: NextRequest): Promise<NextResponse> {
  return handleRequest(getUsers, req);
}

// Função para criar um novo usuário
export async function POST(req: NextRequest): Promise<NextResponse> {
  return handleRequest(createUser, req);
}
