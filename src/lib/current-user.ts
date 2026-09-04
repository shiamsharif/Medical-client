import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api-client";
import type { UserRole } from "@/types";

export type OnboardingRole = Exclude<UserRole, "admin">;

export interface CurrentUser {
  authUserId: string;
  name: string;
  email: string;
  image?: string;
  phone?: string;
  gender?: string;
  location?: string;
  bloodGroup?: string;
  role: UserRole;
  status: string;
}

export function getCurrentUser(signal?: AbortSignal) {
  return apiRequest<CurrentUser>("/api/users/me", { signal });
}

export function completeOnboarding(input: {
  role: OnboardingRole;
  name: string;
  email: string;
  image?: string;
}) {
  return apiRequest<CurrentUser>("/api/users/onboarding", {
    method: "POST",
    body: input,
  });
}

export function useCurrentUser(enabled = true) {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: ({ signal }) => getCurrentUser(signal),
    enabled,
    retry: false,
  });
}
