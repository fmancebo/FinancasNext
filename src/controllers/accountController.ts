import Account from "../models/Account";
import User from "../models/User"; // Importar o modelo User
import { addMonths, setDate } from "date-fns";

// Tipo para os dados da conta
interface AccountData {
  valor?: number;
  descricao?: string;
  tipo?: string;
  forma?: string;
  dataVencimento?: Date;
  status?: string;
  parcelas?: number;
}

// Tipo para os dados da conta (atualização)
interface UpdateAccountData {
  valor?: number;
  descricao?: string;
  tipo?: string;
  forma?: string;
  dataVencimento?: string;
  status?: string;
  parcelas?: number;
}

// Função para listar todas as contas de um usuário específico
export async function getAccounts(userId: string) {
  try {
    if (!userId) {
      throw new Error("User ID is required.");
    }

    // Verificar se o usuário existe
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found.");
    }

    // Consultar as contas com base no usuárioId
    const accounts = await Account.find({ usuarioId: userId });

    return accounts;
  } catch (err) {
    console.error(err);
    throw new Error("Internal server error.");
  }
}

// Função para mostrar uma conta específica de um usuário
export async function showAccount(userId: string, accountId: string) {
  try {
    if (!userId || !accountId) {
      throw new Error("User ID and Account ID are required.");
    }

    // Verificar se o usuário existe
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found.");
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

// Função para criar uma nova conta ou dividir em parcelas
export async function createAccount(userId: string, data: AccountData) {
  try {
    if (!data) {
      throw new Error("Data is required.");
    }

    const { valor, parcelas = 1, dataVencimento, ...rest } = data;

    if (!valor || !dataVencimento) {
      throw new Error("Valor and Data de Vencimento are required.");
    }

    // Verificar se o usuário existe
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found.");
    }

    // Ajustar a data de vencimento adicionando 1 dia
    const vencimentoInicial = new Date(dataVencimento);
    vencimentoInicial.setDate(vencimentoInicial.getDate() + 1); // Adiciona 1 dia

    // Atualizar contas existentes com status "pendente" ou "vencida"
    await Account.updateMany(
      {
        usuarioId: userId,
        dataVencimento: { $lt: vencimentoInicial }, // Data de vencimento anterior à nova conta
        status: { $in: ["pendente", "vencida"] }, // Status "pendente" ou "vencida"
      },
      { $set: { status: "paga" } } // Atualiza o status para "pagas"
    );

    // Se o número de parcelas for maior que 1, dividimos o valor e criamos múltiplas contas
    const contasCriadas = [];
    const valorPorParcela = valor / parcelas;

    const diaFixo = vencimentoInicial.getDate(); // Pega o dia do vencimento inicial

    for (let i = 0; i < parcelas; i++) {
      let vencimentoParcela = addMonths(vencimentoInicial, i); // Adiciona 'i' meses
      vencimentoParcela = setDate(vencimentoParcela, diaFixo); // Garante que o dia seja sempre o mesmo do inicial

      // Cria uma nova conta para cada parcela
      const novaConta = await Account.create({
        usuarioId: userId,
        valor: valorPorParcela,
        dataVencimento: vencimentoParcela,
        parcelas: i + 1, // Incrementa o número da parcela
        ...rest, // Inclui o restante dos dados (descricao, tipo, forma, status)
      });

      contasCriadas.push(novaConta); // Adiciona a nova conta à lista
    }

    return contasCriadas; // Retorna as contas criadas
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
    if (!userId || !accountId) {
      throw new Error("User ID and Account ID are required.");
    }

    // Verificar se o usuário existe
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found.");
    }

    // Ajustar a data de vencimento se estiver presente
    if (data?.dataVencimento) {
      const vencimentoDate = new Date(data.dataVencimento);
      vencimentoDate.setDate(vencimentoDate.getDate() + 1); // Adiciona 1 dia
      data.dataVencimento = vencimentoDate.toISOString(); // Converte para string
    }

    const updatedAccount = await Account.findOneAndUpdate(
      { _id: accountId, usuarioId: userId },
      {
        $set: data,
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
    if (!userId || !accountId) {
      throw new Error("User ID and Account ID are required.");
    }

    // Verificar se o usuário existe
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found.");
    }

    // Encontrar e deletar a conta com base no userId e accountId
    const account = await Account.findOne({
      _id: accountId,
      usuarioId: userId,
    });

    if (!account) {
      throw new Error("Account not found.");
    }

    await Account.deleteOne({ _id: accountId, usuarioId: userId });

    return { message: "Account deleted successfully." };
  } catch (err) {
    console.error(err);
    throw new Error("Internal server error.");
  }
}
