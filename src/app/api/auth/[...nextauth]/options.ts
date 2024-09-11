import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "../../../../models/User";
import { createUser } from "../../../../controllers/userController";
import { checkPassword } from "../../../../services/auth";

export const options: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      async profile(profile) {
        // Verifica se o usuário existe; se não, cria um novo
        const existingUser = await User.findOne({ email: profile.email });

        if (!existingUser) {
          await createUser({
            name: profile.name!,
            email: profile.email!,
            // Password é opcional e será uma string vazia ou uma senha gerada
            password: "", // Pode ser uma senha padrão ou string vazia
            authMethod: "google",
          });
        }

        return {
          id: profile.sub!,
          name: profile.name!,
          email: profile.email!,
          image: profile.picture,
          isAdmin: false,
        };
      },
    }),
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Seu email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Procura o usuário no banco de dados
        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          return null; // Retorna null se o usuário não for encontrado
        }

        // Verifica a senha usando a função checkPassword
        const isPasswordValid = await checkPassword(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null; // Retorna null se a senha estiver incorreta
        }

        // Retorna o usuário se as credenciais estiverem corretas
        return {
          id: user._id.toString(), // Cast do _id para string
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin, // Certifique-se de retornar o isAdmin aqui
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: process.env.JWT_SECRET!,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isAdmin = user.isAdmin || false; // Inclui isAdmin no token
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.isAdmin = token.isAdmin as boolean;
      }
      return session;
    },
  },
};
