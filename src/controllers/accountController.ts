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
// Função para criar uma conta atualizando alguns dados
export async function createAccount(userId: string, data: AccountData) {
  try {
    if (!data) {
      throw new Error("Data is required.");
    }

    const { valor, parcelas = 1, dataVencimento, forma, ...rest } = data;

    if (!valor || !dataVencimento || !forma) {
      throw new Error("Valor, Data de Vencimento and Forma are required.");
    }

    const user = await User.findById(userId); // Busca o usuário no banco
    if (!user) {
      throw new Error("User not found.");
    }

    const vencimentoInicial = new Date(dataVencimento); // Cria a data de vencimento inicial
    vencimentoInicial.setDate(vencimentoInicial.getDate() + 1); // Adiciona 1 dia

    // Atualiza contas existentes apenas se a forma for "credito"
    if (forma === "credito") {
      await Account.updateMany(
        {
          usuarioId: userId,
          dataVencimento: { $lt: vencimentoInicial }, // Filtra vencimentos anteriores
          status: { $in: ["pendente", "vencida"] }, // Filtra contas pendentes ou vencidas
          forma: "credito", // Verifica a forma
        },
        { $set: { status: "paga" } } // Atualiza o status das contas
      );
    }

    const contasCriadas = [];
    const valorPorParcela = valor / parcelas;
    const diaFixo = vencimentoInicial.getDate();

    // Loop para criar contas baseado no número de parcelas
    for (let i = 0; i < parcelas; i++) {
      let vencimentoParcela = addMonths(vencimentoInicial, i);
      vencimentoParcela = setDate(vencimentoParcela, diaFixo);

      // Cria nova conta
      const novaConta = await Account.create({
        usuarioId: userId,
        valor: valorPorParcela,
        dataVencimento: vencimentoParcela,
        parcelas: i + 1, // Incrementa número da parcela
        forma,
        ...rest,
      });

      contasCriadas.push(novaConta);
    }

    return contasCriadas;
  } catch (err) {
    console.error("Erro ao criar conta:", err);
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
    // Verifica se os IDs do usuário e da conta são fornecidos
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

    // Atualiza contas existentes apenas se a forma for "credito"
    if (data?.forma === "credito") {
      await Account.updateMany(
        {
          usuarioId: userId,
          dataVencimento: {
            $lt: data?.dataVencimento
              ? new Date(data.dataVencimento)
              : new Date(),
          }, // Vencimentos anteriores
          status: { $in: ["pendente", "vencida"] }, // Pendentes ou vencidas
          forma: "credito", // Verifica a forma
        },
        { $set: { status: "paga" } } // Atualiza o status
      );
    }

    // Realiza a atualização da conta
    const updatedAccount = await Account.findOneAndUpdate(
      { _id: accountId, usuarioId: userId },
      {
        $set: data,
      },
      { new: true } // Retorna a conta atualizada
    );

    if (!updatedAccount) {
      throw new Error("Account not found.");
    }

    return updatedAccount; // Retorna a conta atualizada
  } catch (err) {
    console.error(err); // Log do erro
    throw new Error("Internal server error."); // Erro genérico
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
