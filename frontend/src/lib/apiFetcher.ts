const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetcher<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, options);

  if (!response.ok) {
    const error = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;

    throw new Error(error?.error ?? `HTTP error ${response.status}`);
  }

  return response.json() as Promise<T>;
}
