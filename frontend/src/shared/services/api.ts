const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

export async function apiRequest<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_URL}${url}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
    ...options,
  });

  if (!response.ok) {
    const data = await response
      .json()
      .catch(() => ({ message: "Erro inesperado" }));

    throw new Error(data.message ?? "Erro inesperado");
  }

  return response.json() as Promise<T>;
}
