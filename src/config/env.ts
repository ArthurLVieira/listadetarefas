const API_URL = import.meta.env.VITE_API_URL as string | undefined;

if (!API_URL) {
  throw new Error(
    "VITE_API_URL não está definida. Crie .env.local na raiz do projeto " +
      "e reinicie o Vite (Ctrl+C + npm run dev).",
  );
}

const HOST_URL = new URL(API_URL).origin;

export const env = {
  apiUrl: API_URL,
  hostUrl: HOST_URL,
  oauth2Url:
    (import.meta.env.VITE_OAUTH2_URL as string | undefined) ??
    `${HOST_URL}/oauth2/authorization/google`,
} as const;
