import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/prisma/client";

const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Admin-Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Email" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password",
        },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // check if admin
        const admin = await prisma.admin.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (admin && credentials.password === admin.password) {
          return {
            id: admin.id.toString(),
            name: admin.name,
            email: admin.email,
            role: "admin",
            image: "",
          };
        }

        // check if teacher

        const teacher = await prisma.teacher.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (teacher && credentials.password === teacher.password) {
          return {
            id: teacher.id.toString(),
            name: teacher.name,
            email: teacher.email,
            role: "teacher",
            image: "",
          };
        }

        // check if student

        const student = await prisma.student.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (student && credentials.password === student.password) {
          return {
            id: student.id.toString(),
            name: student.name,
            email: student.email,
            role: "student",
            image: "",
          };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    jwt: async ({ token }) => {
      // if admin
      const admin = await prisma.admin.findUnique({
        where: {
          email: token.email!,
        },
      });
      if (admin) {
        token.role = "admin";
        return token;
      }

      // if teacher
      const teacher = await prisma.teacher.findUnique({
        where: {
          email: token.email!,
        },
      });
      if (teacher) {
        token.role = "teacher";
        return token;
      }

      // if student
      const student = await prisma.student.findUnique({
        where: {
          email: token.email!,
        },
      });
      if (student) {
        token.role = "student";
        return token;
      }

      return token;
    },
    session: async ({ session, token }) => {
      session.user.role = token.role;
      session.user.id = (token.sub && parseInt(token.sub)) || null;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
