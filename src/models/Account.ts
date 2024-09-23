import mongoose, { Schema, Document, Model } from "mongoose";

interface IConta extends Document {
  usuarioId: mongoose.Schema.Types.ObjectId;
  valor: number;
  descricao: string;
  tipo: "entrada" | "saida";
  forma: "debito" | "credito" | "outro";
  dataVencimento?: Date;
  status: "pendente" | "paga" | "vencida";
  parcelas?: number;
  criadoEm: Date;
}

const contaSchema = new Schema<IConta>(
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
    descricao: {
      type: String,
      required: true,
    },
    tipo: {
      type: String,
      enum: ["entrada", "saida"],
      required: true,
    },
    forma: {
      type: String,
      enum: ["debito", "credito", "outro"],
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
    parcelas: {
      type: Number,
      required: false,
      default: 1,
    },
  },
  { timestamps: true }
);

const Conta: Model<IConta> =
  mongoose.models.Conta || mongoose.model<IConta>("Conta", contaSchema);

export default Conta;
