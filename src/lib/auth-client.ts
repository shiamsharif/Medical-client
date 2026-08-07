import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { API_URL } from "@/lib/api-client";

export const authClient = createAuthClient({
  baseURL: API_URL,
  fetchOptions: { credentials: "include" },
  plugins: [inferAdditionalFields({ user: { role: { type: "string", required: false } } })],
});

export const { signIn, signOut, signUp, useSession } = authClient;
