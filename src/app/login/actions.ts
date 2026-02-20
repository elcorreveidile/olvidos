"use server";

import { signIn } from "@/lib/auth";

export async function loginWithGithub() {
  await signIn("github", { redirectTo: "/" });
}

export async function loginWithCredentials(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "CredentialsSignin" };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/admin",
    });
  } catch (error) {
    // NEXT_REDIRECT is thrown when signIn succeeds - this is normal
    // Only return error if it's a different error
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error; // Re-throw to allow redirect
    }
    console.error("Credentials login error:", error);
    return { error: "CredentialsSignin" };
  }
}
