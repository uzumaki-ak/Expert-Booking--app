// EXPO_PUBLIC_* prefixed vars are inlined at build time so they work everywhere

const required = (key: string, value: string | undefined): string => {
  if (!value) {
    throw new Error(`Missing required env var: ${key}`);
  }
  return value;
};

export const env = {
  API_BASE_URL: required("EXPO_PUBLIC_API_BASE_URL", process.env.EXPO_PUBLIC_API_BASE_URL),
  SOCKET_URL: required("EXPO_PUBLIC_SOCKET_URL", process.env.EXPO_PUBLIC_SOCKET_URL),
} as const;
