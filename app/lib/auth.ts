// import { PrismaClient } from "@prisma/client";
// import { PrismaAdapter } from "@next-auth/prisma-adapter";
// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import bcrypt from "bcrypt";
// import { JWT } from "next-auth/jwt";
// import { AdapterUser } from "next-auth/adapters";

// const prisma = new PrismaClient();

// interface CustomUser {
//   id: number;
//   name?: string;
//   email?: string;
// }

// interface CustomSession {
//   user: {
//     id: number;
//     name?: string;
//     email?: string;
//   };
//   expires: string;
// }

// interface CustomJWT extends JWT {
//   id?: number;
//   name?: string | null;
//   email?: string | null;
// }

// declare module "next-auth" {
//   interface Session {
//     user: {
//       id: number;
//       name?: string;
//       email?: string;
//     };
//     expires: string;
//   }

//   interface User {
//     id: number;
//     name?: string;
//     email?: string;
//   }
// }

// export const authOption = {
//   adapter: PrismaAdapter(prisma),
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials.password) return null;

//         const user = await prisma.user.findUnique({
//           where: { email: credentials.email },
//         });

//         if (!user) return null;

//         const passwordsMatch = await bcrypt.compare(
//           credentials.password,
//           user.password
//         );
//         if (!passwordsMatch) return null;

//         return {
//           id: user.id,
//           name: user.name,
//           email: user.email,
//         } as CustomUser;
//       },
//     }),
//   ],
//   session: {
//     strategy: "jwt" as const,
//   },
//   callbacks: {
//     async session({
//       session,
//       token,
//     }: {
//       session: CustomSession;
//       token: CustomJWT;
//     }) {
//       if (session.user) {
//         session.user.id = token.sub as unknown as number;
//         session.user.name = token.name ?? undefined;
//         session.user.email = token.email ?? undefined;
//       }
//       session.expires = new Date(
//         Date.now() + 30 * 24 * 60 * 60 * 1000
//       ).toISOString();
//       return session;
//     },
//     async jwt({
//       token,
//       user,
//     }: {
//       token: CustomJWT;
//       user: CustomUser | AdapterUser;
//     }) {
//       if (user) {
//         token.sub = user.id.toString();
//         token.name = user.name ?? undefined;
//         token.email = user.email ?? undefined;
//       }
//       return token;
//     },
//   },
// };

// export default NextAuth(authOption);

// app/lib/auth.ts

import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/prisma/client";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          console.log("Missing credentials");
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user) {
            console.log("User not found for email:", credentials.email);
            return null;
          }

          const passwordsMatch = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!passwordsMatch) {
            console.log("Password doesn't match for user:", user.email);
            return null;
          }

          console.log("Authentication successful for:", user.email);

          return {
            id: user.id,
            name: user.name,
            email: user.email,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id =
          typeof token.id === "number" ? token.id : Number(token.id);
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
};
