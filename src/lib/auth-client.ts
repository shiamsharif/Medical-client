import { createAuthClient } from "better-auth/react";
import { API_URL } from "@/lib/api-client";

export const authClient = createAuthClient({
  baseURL: API_URL,
  fetchOptions: { credentials: "include" },
});

export const { signIn, signOut, signUp, useSession } = authClient;
