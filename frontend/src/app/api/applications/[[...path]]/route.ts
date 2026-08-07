import { auth0 } from "@/lib/auth0";
import type { NextRequest } from "next/server";

type Context = { params: Promise<{ path?: string[] }> };

function apiError(status: number, errorCode: string, message: string) {
  return Response.json({ errorCode, message }, { status });
}

async function proxyRequest(request: NextRequest, context: Context) {
  const apiUrl = process.env.API_URL;
  if (!apiUrl) {
    return apiError(500, "INTERNAL_ERROR", "API non configurata");
  }

  let token: string;
  try {
    ({ token } = await auth0.getAccessToken());
  } catch {
    return apiError(401, "UNAUTHORIZED", "Sessione non valida o scaduta");
  }

  const { path = [] } = await context.params;
  const suffix = path.map(encodeURIComponent).join("/");
  const target = `${apiUrl}/applications${suffix ? `/${suffix}` : ""}${request.nextUrl.search}`;
  const headers = new Headers({ Authorization: `Bearer ${token}` });
  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("Content-Type", contentType);

  try {
    const response = await fetch(target, {
      method: request.method,
      headers,
      body:
        request.method === "GET" || request.method === "HEAD"
          ? undefined
          : await request.text(),
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
    });

    const responseHeaders = new Headers();
    const responseContentType = response.headers.get("content-type");
    if (responseContentType) {
      responseHeaders.set("Content-Type", responseContentType);
    }

    return new Response(response.body, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch {
    return apiError(502, "NETWORK_ERROR", "Impossibile connettersi al server");
  }
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
