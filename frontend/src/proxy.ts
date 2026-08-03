import { auth0 } from "./lib/auth0";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const response = await auth0.middleware(request);

  if (
    !request.nextUrl.pathname.startsWith("/auth/") &&
    (await auth0.getSession(request))
  ) {
    await auth0.getAccessToken(request, response);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
