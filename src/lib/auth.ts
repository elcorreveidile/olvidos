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

// Validate required environment variables
const authSecret = process.env.AUTH_SECRET;
if (!authSecret) {
  console.error("❌ AUTH_SECRET is not defined in environment variables");
}

const githubId = process.env.AUTH_GITHUB_ID;
const githubSecret = process.env.AUTH_GITHUB_SECRET;
if (!githubId || !githubSecret) {
  console.error("❌ GitHub OAuth credentials are not defined");
}

// Log environment info for debugging
console.log("[Auth] Environment check:", {
  hasSecret: !!authSecret,
  hasGitHubId: !!githubId,
  hasGitHubSecret: !!githubSecret,
  nodeEnv: process.env.NODE_ENV,
  vercelUrl: process.env.VERCEL_URL,
  url: process.env.URL,
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/login?error=true",
  },
  providers: [
    ...(githubId && githubSecret ? [GitHub({
      clientId: githubId,
      clientSecret: githubSecret,
    })] : []),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        try {
          const parsed = loginSchema.safeParse(credentials);
          if (!parsed.success) {
            console.error("[Auth] Invalid credentials format:", parsed.error);
            return null;
          }

          const user = await db.user.findUnique({
            where: { email: parsed.data.email },
          });

          if (!user) {
            console.error("[Auth] User not found:", parsed.data.email);
            return null;
          }

          if (!user.password) {
            console.error("[Auth] User has no password:", user.email);
            return null;
          }

          const isValid = await bcrypt.compare(
            parsed.data.password,
            user.password
          );

          if (!isValid) {
            console.error("[Auth] Invalid password for:", user.email);
            return null;
          }

          console.log("[Auth] Successful login for:", user.email, "role:", user.role);

          return {
            id: user.id,
            email: user.email,
            name: user.name || "Usuario",
            image: user.image,
            role: user.role || "USER",
          };
        } catch (error) {
          console.error("[Auth] Authorize error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      try {
        if (account?.provider === "github" && user.email) {
          console.log("[Auth] GitHub sign in for:", user.email);

          // Check if user exists, if not create one
          const existingUser = await db.user.findUnique({
            where: { email: user.email },
          });

          if (!existingUser) {
            console.log("[Auth] Creating new user from GitHub:", user.email);
            // Create new user with USER role (not MEMBER - needs to register as member)
            await db.user.create({
              data: {
                email: user.email,
                name: user.name,
                image: user.image,
                role: "USER",
              },
            });
            console.log("[Auth] User created successfully");
            // Keep the default USER role for new users
            return true;
          } else {
            console.log("[Auth] Existing user found:", existingUser.email, "role:", existingUser.role);
            // Update user object with role from database
            user.role = existingUser.role;
            user.id = existingUser.id;
            console.log("[Auth] Updated user object with role from DB:", user.role);
          }
        }
        return true;
      } catch (error) {
        console.error("[Auth] Error in signIn callback:", error);
        // Still allow sign in even if DB operations fail
        return true;
      }
    },
    async jwt({ token, user, account }) {
      if (user) {
        console.log("[Auth] JWT callback - user data:", { id: user.id, email: user.email, role: user.role, provider: account?.provider });
        // User data from authorize callback is already available
        // No need to query database again
        token.role = user.role || "USER";
        token.id = user.id;
        console.log("[Auth] JWT token updated with role:", token.role, "id:", token.id);
      } else {
        console.log("[Auth] JWT callback - using existing token, role:", token.role);
      }
      return token;
    },
    async session({ session, token }) {
      // Ensure session.user exists and has required fields
      if (session.user) {
        session.user.role = (token.role as string) || "USER";
        session.user.id = (token.id as string) || "";
        console.log("[Auth] Session callback - user:", { email: session.user.email, role: session.user.role, id: session.user.id });
      } else {
        console.error("[Auth] Session callback - session.user is null!");
      }
      return session;
    },
  },
});
