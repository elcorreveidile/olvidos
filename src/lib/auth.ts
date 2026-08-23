import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import crypto from "crypto";
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

const googleId = process.env.AUTH_GOOGLE_ID;
const googleSecret = process.env.AUTH_GOOGLE_SECRET;

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
    ...(googleId && googleSecret ? [Google({
      clientId: googleId,
      clientSecret: googleSecret,
    })] : []),
    // Enlace mágico: valida el token de un solo uso guardado (hasheado) en
    // VerificationToken y emite la sesión JWT. El token se genera y envía por
    // correo desde /api/auth/magic-link (con verificación humana previa).
    Credentials({
      id: "magic-link",
      name: "magic-link",
      credentials: {
        token: { label: "Token", type: "text" },
        email: { label: "Email", type: "email" },
      },
      async authorize(credentials) {
        try {
          const rawToken =
            typeof credentials?.token === "string" ? credentials.token : "";
          const email =
            typeof credentials?.email === "string"
              ? credentials.email.toLowerCase().trim()
              : "";
          if (!rawToken || !email) return null;

          const hashed = crypto
            .createHash("sha256")
            .update(rawToken)
            .digest("hex");

          const vt = await db.verificationToken.findUnique({
            where: { token: hashed },
          });
          // Debe ser un token de tipo MAGIC_LINK: un token de reset de
          // contraseña no puede servir para iniciar sesión.
          if (
            !vt ||
            vt.identifier !== email ||
            vt.type !== "MAGIC_LINK" ||
            vt.expires < new Date()
          ) {
            return null;
          }

          // Un solo uso: invalida los enlaces mágicos pendientes de ese email
          // (sin tocar un posible token de reset de contraseña en curso).
          await db.verificationToken.deleteMany({
            where: { identifier: email, type: "MAGIC_LINK" },
          });

          const user = await db.user.findUnique({ where: { email } });
          if (!user) return null;
          if (!user.emailVerified) {
            await db.user.update({
              where: { id: user.id },
              data: { emailVerified: new Date() },
            });
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name || "Usuario",
            image: user.image,
            role: user.role || "USER",
          };
        } catch (error) {
          console.error("[Auth] magic-link authorize error:", error);
          return null;
        }
      },
    }),
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
        // Providers OAuth (GitHub, Google): el usuario se enlaza/crea por email.
        // Mutamos `user.id`/`user.role` con los valores reales de la BD para que
        // el callback jwt propague el id (cuid) y el rol correctos.
        const isOAuth =
          account?.provider === "github" || account?.provider === "google";

        if (isOAuth && user.email) {
          const existingUser = await db.user.findUnique({
            where: { email: user.email },
          });

          if (!existingUser) {
            const created = await db.user.create({
              data: {
                email: user.email,
                name: user.name,
                image: user.image,
                role: "USER", // OAuth crea usuario, no socio: irá a /hazte-socio
              },
            });
            user.id = created.id;
            user.role = "USER";
          } else {
            user.id = existingUser.id;
            user.role = existingUser.role;
          }
        }
        return true;
      } catch (error) {
        console.error("[Auth] Error in signIn callback:", error);
        // Permitir el inicio de sesión aunque falle la operación en BD.
        return true;
      }
    },
    async jwt({ token, user, account }) {
      if (user) {
        // Inicio de sesión: fija id/rol y el tokenVersion actual del usuario.
        token.role = user.role || "USER";
        token.id = user.id;
        const uv = (user as { tokenVersion?: number }).tokenVersion;
        if (typeof uv === "number") {
          token.tokenVersion = uv;
        } else if (user.id) {
          try {
            const dbUser = await db.user.findUnique({
              where: { id: user.id },
              select: { tokenVersion: true },
            });
            token.tokenVersion = dbUser?.tokenVersion ?? 0;
          } catch (error) {
            console.error("[Auth] Error reading tokenVersion on sign-in:", error);
            token.tokenVersion = 0;
          }
        }
        console.log("[Auth] JWT set:", { id: token.id, role: token.role, provider: account?.provider });
        return token;
      }

      // Llamadas posteriores: se valida contra la BD para poder CERRAR sesiones
      // tras un cambio de contraseña (la sesión es JWT). Si el tokenVersion del
      // token no coincide con el de la BD, o el usuario ya no existe, se
      // devuelve null y next-auth limpia la cookie de sesión (logout).
      if (token.id) {
        try {
          const dbUser = await db.user.findUnique({
            where: { id: token.id as string },
            select: { role: true, tokenVersion: true },
          });
          if (!dbUser) return null;
          const current = (token.tokenVersion as number | undefined) ?? 0;
          if (current !== dbUser.tokenVersion) return null;
          token.role = dbUser.role;
        } catch (error) {
          // Ante un fallo de BD no cerramos la sesión (evita expulsar por un
          // problema transitorio); se conserva el token tal cual.
          console.error("[Auth] Error validating token against DB:", error);
        }
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
