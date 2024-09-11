import mongoose, { Schema, Document } from "mongoose";

// Interface para o documento da conta
interface IConta extends Document {
  usuarioId: mongoose.Schema.Types.ObjectId;
  valor: number;
  tipo: "entrada" | "saída";
  forma: "débito" | "crédito";
  dataVencimento?: Date;
  status: "pendente" | "paga" | "vencida";
  criadoEm: Date;
}

// Definição do esquema para o modelo de Conta
const contaSchema = new Schema(
  {
    usuarioId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    valor: {
      type: Number,
      required: true,
    },
    tipo: {
      type: String,
      enum: ["entrada", "saida"],
      required: true,
    },
    forma: {
      type: String,
      enum: ["debito", "credito"],
      required: true,
    },
    dataVencimento: {
      type: Date,
      required: false,
    },
    status: {
      type: String,
      enum: ["pendente", "paga", "vencida"],
      required: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Criação do modelo a partir do esquema
const Conta = mongoose.model<IConta>("Conta", contaSchema);

export default Conta;
