import bcrypt from "bcryptjs";

// Função para criar hash da senha
export const createPasswordHash = async (password: string) => {
  return bcrypt.hash(password, 8);
};

// Função para verificar a senha
export const checkPassword = async (userPassword: string, password: string) => {
  return bcrypt.compare(password, userPassword);
};
