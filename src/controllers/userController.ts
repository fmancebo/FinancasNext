// src/controllers/userController.ts
import User from "../models/User";
import { createPasswordHash } from "../services/auth";

// Tipos específicos para os dados da requisição
type UpdateUserData = {
  name?: string;
  email?: string;
  password?: string;
};

export async function getUsers() {
  try {
    const users = await User.find();
    return users;
  } catch (err) {
    console.error("Erro ao buscar usuários:", err);
    throw new Error("Internal server error.");
  }
}

export async function showUser(id: string) {
  try {
    const user = await User.findById(id);
    if (!user) {
      throw new Error("User not found.");
    }
    return user;
  } catch (err) {
    console.error("Error fetching user:", err);
    throw new Error("Internal server error.");
  }
}

// Função para criar um novo usuário
export async function createUser(data: {
  name: string;
  email: string;
  password?: string; // Senha opcional
  secretAdmin?: string;
  authMethod?: "google"; // Método de autenticação
}) {
  try {
    console.log("Received data:", data); // Para depuração
    const { name, email, password, secretAdmin, authMethod } = data;

    // Verifica se o e-mail já está registrado
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // Lança um erro com uma mensagem específica
      throw new Error(`User with email ${email} already exists.`);
    }

    let finalPassword;

    // Se a autenticação for via Google, a senha pode ser nula ou uma senha gerada temporariamente
    if (authMethod === "google") {
      finalPassword = ""; // Ou você pode definir uma senha padrão se necessário
    } else {
      finalPassword = password || ""; // Usa a senha fornecida ou uma senha vazia
    }

    // Criptografa a senha do usuário
    const encryptedPassword = await createPasswordHash(finalPassword);

    // Cria um novo usuário, definindo isAdmin com base no secretAdmin
    const newUser = await User.create({
      name,
      email,
      password: encryptedPassword,
      isAdmin: secretAdmin === process.env.ADMIN_SECRET,
    });

    return newUser;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Error in createUser:", err.message);
      throw err; // Lança o erro original
    } else {
      console.error("Unknown error:", err);
      throw new Error("Internal server error."); // Erro genérico
    }
  }
}

// Função para atualizar um usuário existente
export async function updateUser(
  id: string,
  data?: UpdateUserData // data pode ser undefined
) {
  try {
    // Garantir que data é um objeto vazio se não for fornecido
    const { name, email, password } = data || {};

    // Encontra o usuário pelo ID
    const user = await User.findById(id);

    if (!user) {
      throw new Error("User not found.");
    }

    // Atualiza a senha se fornecida, senão mantém a existente
    const encryptedPassword = password
      ? await createPasswordHash(password)
      : user.password;

    // Atualiza o usuário no banco de dados
    await User.updateOne(
      { _id: id },
      {
        $set: {
          email,
          password: encryptedPassword,
          name,
        },
      }
    );

    return { message: "User updated successfully." };
  } catch (err) {
    console.error(err);
    throw new Error("Internal server error.");
  }
}

// Função para deletar um usuário
export async function deleteUser(id: string) {
  try {
    const user = await User.findById(id);

    if (!user) {
      throw new Error("User not found.");
    }

    await User.deleteOne({ _id: id });

    return { message: "User deleted successfully." };
  } catch (err) {
    console.error(err);
    throw new Error("Internal server error.");
  }
}
