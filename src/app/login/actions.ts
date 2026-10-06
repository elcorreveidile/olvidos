"use server";

import { redirect } from "next/navigation";
import { signIn } from "@/lib/auth";

export async function loginWithGithub() {
  console.log("[Login Action] GitHub login attempted");
  try {
    await signIn("github", { redirectTo: "/post-login" });
  } catch (error) {
    console.error("[Login Action] GitHub login error:", error);
    throw error;
  }
}

export async function loginWithGoogle() {
  console.log("[Login Action] Google login attempted");
  try {
    await signIn("google", { redirectTo: "/post-login" });
  } catch (error) {
    console.error("[Login Action] Google login error:", error);
    throw error;
  }
}

export async function loginWithCredentials(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  console.log("[Login Action] Credentials login attempted");

  if (!email || !password) {
    console.log("[Login Action] Missing credentials");
    redirect("/login?error=CredentialsSignin");
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/post-login",
    });
    // signIn redirige lanzando NEXT_REDIRECT; si volviera sin lanzar, seguimos.
    redirect("/post-login");
  } catch (error) {
    // NEXT_REDIRECT is thrown when signIn succeeds - this is normal
    // Only return error if it's a different error
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      console.log("[Login Action] NEXT_REDIRECT - re-throwing");
      throw error; // Re-throw to allow redirect
    }
    // El formulario es un <form action> sin estado: el único modo de que el
    // usuario vea el fallo es volver a /login con el motivo en la URL.
    console.error("[Login Action] Credentials login error:", error);
  }
  redirect("/login?error=CredentialsSignin");
}
