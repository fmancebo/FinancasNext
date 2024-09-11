import Account from "../models/Account";

interface AccountData {
  valor?: number;
  tipo?: string;
  forma?: string;
  dataVencimento?: string;
  status?: string;
}
// Tipo para os dados da conta
interface UpdateAccountData {
  valor?: number;
  tipo?: string;
  forma?: string;
  dataVencimento?: string;
  status?: string;
}

// Função para listar todas as contas de um usuário específico
export async function getAccounts(userId: string) {
  try {
    if (!userId) {
      // Verificar se o userId está presente
      throw new Error("User ID is required.");
    }

    // Consultar as contas com base no usuárioId
    const accounts = await Account.find({ usuarioId: userId });

    // Se não houver contas, retornar um array vazio
    return accounts;
  } catch (err) {
    console.error(err);
    throw new Error("Internal server error.");
  }
}

// Função para mostrar uma conta específica de um usuário
export async function showAccount(userId: string, accountId: string) {
  try {
    // Verificar se os IDs foram fornecidos
    if (!userId || !accountId) {
      throw new Error("User ID and Account ID are required.");
    }

    // Consultar a conta com base no userId e accountId
    const account = await Account.findOne({
      _id: accountId,
      usuarioId: userId,
    });

    if (!account) {
      throw new Error("Account not found.");
    }

    return account;
  } catch (err) {
    console.error(err);
    throw new Error("Internal server error.");
  }
}

// Função para criar uma nova conta
export async function createAccount(userId: string, data?: AccountData) {
  try {
    // Verificar se os dados necessários estão presentes
    if (!data) {
      throw new Error("Data is required.");
    }

    // Cria uma nova conta associada ao userId
    const newAccount = await Account.create({
      ...data,
      usuarioId: userId,
    });

    return newAccount;
  } catch (err) {
    console.error(err);
    throw new Error("Internal server error.");
  }
}

// Função para atualizar parcialmente uma conta existente
export async function updateAccount(
  userId: string,
  accountId: string,
  data?: UpdateAccountData
) {
  try {
    const { valor, tipo, forma, dataVencimento, status } = data || {};

    if (!userId || !accountId) {
      throw new Error("User ID and Account ID are required.");
    }

    const updatedAccount = await Account.findOneAndUpdate(
      { _id: accountId, usuarioId: userId },
      {
        $set: {
          valor,
          tipo,
          forma,
          dataVencimento,
          status,
        },
      },
      { new: true } // Retornar a conta atualizada
    );

    if (!updatedAccount) {
      throw new Error("Account not found.");
    }

    return updatedAccount;
  } catch (err) {
    console.error(err);
    throw new Error("Internal server error.");
  }
}

// Função para deletar uma conta
export async function deleteAccount(userId: string, accountId: string) {
  try {
    // Verificar se os dados necessários foram fornecidos
    if (!userId || !accountId) {
      throw new Error("User ID and Account ID are required.");
    }

    // Encontrar a conta com base no userId e accountId
    const account = await Account.findOne({
      _id: accountId,
      usuarioId: userId,
    });

    if (!account) {
      throw new Error("Account not found.");
    }

    // Deletar a conta
    await Account.deleteOne({ _id: accountId, usuarioId: userId });

    return { message: "Account deleted successfully." };
  } catch (err) {
    console.error(err);
    throw new Error("Internal server error.");
  }
}
