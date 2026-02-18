import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await db.user.findUnique({
          where: { email: parsed.data.email },
        });

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(
          parsed.data.password,
          user.password
        );

        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "github" && user.email) {
        // Check if user exists in database
        const existingUser = await db.user.findUnique({
          where: { email: user.email },
        });

        if (!existingUser) {
          // Create user in database
          await db.user.create({
            data: {
              email: user.email,
              name: user.name,
              image: user.image,
              role: "USER",
            },
          });
        }
        return true;
      }
      return true;
    },
    async jwt({ token, user, trigger, session, account }) {
      // Initial sign in
      if (user) {
        // If user logged in with GitHub, fetch role from database
        if (account?.provider === "github" && user.email) {
          const dbUser = await db.user.findUnique({
            where: { email: user.email },
          });
          if (dbUser) {
            token.role = dbUser.role;
            token.id = dbUser.id;
          } else {
            token.role = user.role || "USER";
            token.id = user.id;
          }
        } else {
          token.role = user.role;
          token.id = user.id;
        }
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      }
      // Handle session updates
      if (trigger === "update" && session) {
        token = { ...token, ...session };
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
