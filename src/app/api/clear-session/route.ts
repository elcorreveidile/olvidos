import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const response = NextResponse.json({ success: true });

  // Clear all auth cookies
  const cookies = [
    "__Secure-authjs.session-token",
    "__Host-authjs.csrf-token",
    "__Secure-authjs.callback-url",
    "authjs.session-token",
    "authjs.callback-url",
    "authjs.csrf-token",
  ];

  cookies.forEach((cookie) => {
    response.cookies.delete(cookie);
    response.cookies.set(cookie, "", {
      expires: new Date(0),
      path: "/",
    });
  });

  return response;
}
