import NextAuth, { type DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/prisma";
import { z } from "zod";

declare module "next-auth" {
  interface Session {
    user: { id: string; role: string } & DefaultSession["user"];
  }
}

const loginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(6)
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma) as ReturnType<typeof PrismaAdapter>,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error:  "/login"
  },
  providers: [
    // Google OAuth (optional - only works if GOOGLE_CLIENT_ID is set)
    ...(process.env.GOOGLE_CLIENT_ID ? [Google({
      clientId:     process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    })] : []),

    // Email + Password login
    Credentials({
      name: "credentials",
      credentials: {
        email:    { label: "Email",    type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email }
        });
        if (!user?.password) return null;

        const valid = await bcrypt.compare(parsed.data.password, user.password);
        if (!valid) return null;

        return { id: user.id, email: user.email, name: user.name, image: user.image };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id   = user.id;
        token.role = "USER";
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id   = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    }
  },
  events: {
    async createUser({ user }) {
      if (user.id) {
        await prisma.userPreferences.create({
          data: { userId: user.id }
        }).catch(() => {});
      }
    }
  }
});
