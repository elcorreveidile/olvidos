"use server";

import { signIn } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function loginWithGithub() {
  await signIn("github", { redirectTo: "/" });
}

export async function loginWithCredentials(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    redirect("/login?error=CredentialsSignin");
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/admin",
    });
  } catch (error) {
    console.error("Login error:", error);
    redirect("/login?error=CredentialsSignin");
  }
}
