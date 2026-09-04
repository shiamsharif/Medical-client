import type { Metadata } from "next";
import { AuthCompletion } from "@/features/auth/auth-completion";
import type { OnboardingRole } from "@/lib/current-user";

export const metadata: Metadata = {
  title: "Completing sign in",
  robots: { index: false, follow: false },
};

export default async function Page({
  searchParams,
}: PageProps<"/auth/complete">) {
  const query = await searchParams;
  const roleValue = firstValue(query.role);
  const initialRole: OnboardingRole | undefined =
    roleValue === "patient" || roleValue === "doctor" ? roleValue : undefined;

  return (
    <AuthCompletion
      initialRole={initialRole}
      oauthError={firstValue(query.error)}
    />
  );
}

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
