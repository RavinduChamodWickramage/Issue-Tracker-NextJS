import { PrismaClient } from "@prisma/client";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { JWT } from "next-auth/jwt";
import { AdapterUser } from "next-auth/adapters";

const prisma = new PrismaClient();

interface CustomUser {
  id: number;
  name?: string;
  email?: string;
}

interface CustomSession {
  user: {
    id: number;
    name?: string;
    email?: string;
  };
  expires: string;
}

interface CustomJWT extends JWT {
  id?: number;
  name?: string | null;
  email?: string | null;
}

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      name?: string;
      email?: string;
    };
    expires: string;
  }

  interface User {
    id: number;
    name?: string;
    email?: string;
  }
}

export const authOption = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) return null;

        const passwordsMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!passwordsMatch) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
        } as CustomUser;
      },
    }),
  ],
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    async session({
      session,
      token,
    }: {
      session: CustomSession;
      token: CustomJWT;
    }) {
      if (session.user) {
        session.user.id = token.sub as unknown as number;
        session.user.name = token.name ?? undefined;
        session.user.email = token.email ?? undefined;
      }
      session.expires = new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      ).toISOString();
      return session;
    },
    async jwt({
      token,
      user,
    }: {
      token: CustomJWT;
      user: CustomUser | AdapterUser;
    }) {
      if (user) {
        token.sub = user.id.toString();
        token.name = user.name ?? undefined;
        token.email = user.email ?? undefined;
      }
      return token;
    },
  },
};

export default NextAuth(authOption);
