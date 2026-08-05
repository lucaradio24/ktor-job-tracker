import { AccessTokenError } from "@auth0/nextjs-auth0/errors";
import { NextResponse, type NextRequest } from "next/server";
import { auth0 } from "./lib/auth0";

export async function proxy(request: NextRequest) {
  const response = await auth0.middleware(request);
  const isAuthRoute = request.nextUrl.pathname.startsWith("/auth/");

  // Login, logout e callback vengono gestiti direttamente da Auth0.
  if (isAuthRoute) {
    return response;
  }

  const session = await auth0.getSession(request);

  // Non c'è un utente autenticato: continua normalmente.
  // Il layout protetto lo manderà a /login.
  if (!session) {
    return response;
  }

  try {
    // Controlla l'access token e, se necessario, lo rinnova.
    await auth0.getAccessToken(request, response);
  } catch (error) {
    if (!(error instanceof AccessTokenError)) {
      throw error;
    }

    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set(
      "returnTo",
      `${request.nextUrl.pathname}${request.nextUrl.search}`,
    );

    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
