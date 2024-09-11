import { NextRequest, NextResponse } from "next/server";
import db from "../../../../database";
import {
  showUser,
  updateUser,
  deleteUser,
} from "../../../../controllers/userController";

// Tipos específicos para os dados da requisição
type UpdateUserData = {
  name?: string;
  email?: string;
  password?: string;
};

async function handleRequest<T>(
  handler: (userId: string, data?: UpdateUserData) => Promise<T>,
  req: NextRequest
): Promise<NextResponse> {
  try {
    await db.connect(); // Conectar ao banco de dados

    // Extrair userId da URL
    const pathname = req.nextUrl.pathname;
    const segments = pathname.split("/");
    const userId = segments[segments.length - 1];

    if (typeof userId !== "string") {
      return NextResponse.json(
        { message: "Invalid parameters" },
        { status: 400 }
      );
    }

    // Obter os dados da requisição, se houver
    const data: UpdateUserData | undefined =
      req.method === "PATCH" ? await req.json() : undefined;

    // Garantir que data não é undefined para funções que não aceitam undefined
    if (req.method === "PATCH" && data === undefined) {
      return NextResponse.json(
        { message: "Invalid data provided" },
        { status: 400 }
      );
    }

    const result = await handler(userId, data);
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

// Função para mostrar um usuário específico
export async function GET(req: NextRequest) {
  return handleRequest(showUser, req);
}

// Função para atualizar um usuário existente
export async function PATCH(req: NextRequest) {
  return handleRequest(updateUser, req);
}

// Função para excluir um usuário
export async function DELETE(req: NextRequest) {
  return handleRequest(deleteUser, req);
}
