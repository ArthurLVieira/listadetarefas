export const env = {
  apiUrl: import.meta.env.VITE_API_URL as string,
  oauth2Url: import.meta.env.VITE_OAUTH2_URL as string,
} as const;
