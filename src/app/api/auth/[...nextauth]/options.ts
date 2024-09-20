import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "../../../../models/User";
import { createUser } from "../../../../controllers/userController";
import { checkPassword } from "../../../../services/auth";
import databaseInstance from "../../../../database"; //instância do banco de dados

export const options: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      async profile(profile) {
        // Garantia que a conexão com o banco de dados está estabelecida
        await databaseInstance.connect();

        const existingUser = await User.findOne({ email: profile.email });

        if (!existingUser) {
          await createUser({
            name: profile.name!,
            email: profile.email!,
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
        // Garantia que a conexão com o banco de dados está estabelecida
        await databaseInstance.connect();

        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          return null;
        }

        const isPasswordValid = await checkPassword(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
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
        token.isAdmin = user.isAdmin || false;
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
