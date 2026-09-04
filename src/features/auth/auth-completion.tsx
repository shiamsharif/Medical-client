"use client";

import { HeartPulse } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, Label, Select } from "@/components/ui/core";
import { ApiError } from "@/lib/api-client";
import { signOut, useSession } from "@/lib/auth-client";
import {
  completeOnboarding,
  getCurrentUser,
  type OnboardingRole,
} from "@/lib/current-user";

export function AuthCompletion({
  initialRole,
  oauthError,
}: {
  initialRole?: OnboardingRole;
  oauthError?: string;
}) {
  const router = useRouter();
  const {
    data: session,
    error: sessionError,
    isPending,
    isRefetching,
    refetch,
  } = useSession();
  const attempted = useRef(false);
  const [role, setRole] = useState<OnboardingRole>(initialRole ?? "patient");
  const [needsRole, setNeedsRole] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasRefreshedSession, setHasRefreshedSession] = useState(false);
  const [error, setError] = useState<string>();
  const sessionRef = useRef(session);
  const sessionCheckGeneration = useRef(0);

  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

  const refreshSession = useCallback(async () => {
    const generation = ++sessionCheckGeneration.current;

    // Defer the state transition so effect-driven verification does not cause
    // a synchronous render cascade during mount.
    await new Promise((resolve) => window.setTimeout(resolve, 0));
    if (generation !== sessionCheckGeneration.current) return;
    setHasRefreshedSession(false);

    // Let useSession's initial request finish first, then retry transient
    // serverless cold starts without trusting Better Auth's cookie cache.
    for (const delay of [150, 300, 600]) {
      await new Promise((resolve) => window.setTimeout(resolve, delay));
      if (generation !== sessionCheckGeneration.current) return;
      if (sessionRef.current) break;
      await refetch({ query: { disableCookieCache: true } });
    }

    if (generation === sessionCheckGeneration.current) {
      setHasRefreshedSession(true);
    }
  }, [refetch]);

  useEffect(() => {
    if (!oauthError) void refreshSession();

    return () => {
      sessionCheckGeneration.current += 1;
    };
  }, [oauthError, refreshSession]);

  const saveOnboarding = useCallback(
    async (selectedRole: OnboardingRole) => {
      if (!session?.user) return;
      setIsSaving(true);
      setError(undefined);
      try {
        await completeOnboarding({
          role: selectedRole,
          name: session.user.name,
          email: session.user.email,
          ...(session.user.image ? { image: session.user.image } : {}),
        });
        router.replace("/dashboard");
      } catch (cause) {
        setError(
          cause instanceof Error
            ? cause.message
            : "We could not finish setting up your account.",
        );
        setIsSaving(false);
      }
    },
    [router, session],
  );

  useEffect(() => {
    if (isPending || !session?.user || oauthError || attempted.current) return;
    attempted.current = true;
    void getCurrentUser()
      .then(() => router.replace("/dashboard"))
      .catch((cause: unknown) => {
        if (!(cause instanceof ApiError) || cause.status !== 401) {
          setError(
            cause instanceof Error
              ? cause.message
              : "We could not verify your account.",
          );
          return;
        }
        if (initialRole) {
          void saveOnboarding(initialRole);
          return;
        }
        setNeedsRole(true);
      });
  }, [initialRole, isPending, oauthError, router, saveOnboarding, session]);

  if (oauthError) {
    return (
      <CompletionCard
        title="Google sign-in did not finish"
        description={oauthMessage(oauthError)}
      >
        <Button asChild className="w-full">
          <Link href="/login">Return to sign in</Link>
        </Button>
      </CompletionCard>
    );
  }

  if (hasRefreshedSession && !isPending && !isRefetching && !session) {
    const verificationFailed = Boolean(sessionError);

    return (
      <CompletionCard
        title={
          verificationFailed
            ? "Unable to verify your session"
            : "No active session was found"
        }
        description={
          sessionError?.message ??
          "Please return to sign in and start a new sign-in attempt. Refreshing this page cannot create a new session."
        }
      >
        <div className="space-y-3">
          <Button
            className="w-full"
            onClick={() => {
              void refreshSession();
            }}
          >
            Retry session
          </Button>
          <Button asChild className="w-full" variant="outline">
            <Link href="/login">Return to sign in</Link>
          </Button>
        </div>
      </CompletionCard>
    );
  }

  if (needsRole) {
    return (
      <CompletionCard
        title="Finish setting up your account"
        description="Choose the type of MediCare workspace you need. This is required once for accounts created before onboarding completed."
      >
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void saveOnboarding(role);
          }}
          className="space-y-5"
        >
          <div>
            <Label htmlFor="account-role">Account type</Label>
            <Select
              id="account-role"
              value={role}
              onChange={(event) =>
                setRole(event.target.value as OnboardingRole)
              }
            >
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
            </Select>
          </div>
          {error && (
            <p
              className="rounded-xl bg-red-50 p-3 text-sm text-danger dark:bg-red-950/30"
              role="alert"
            >
              {error}
            </p>
          )}
          <Button className="w-full" disabled={isSaving}>
            {isSaving ? "Finishing setup…" : "Continue to dashboard"}
          </Button>
        </form>
      </CompletionCard>
    );
  }

  return (
    <CompletionCard
      title="Securing your account"
      description="We’re finishing your MediCare profile and preparing your dashboard."
    >
      {error && (
        <>
          <p
            className="rounded-xl bg-red-50 p-3 text-sm text-danger dark:bg-red-950/30"
            role="alert"
          >
            {error}
          </p>
          <Button
            className="w-full"
            variant="outline"
            onClick={() => window.location.reload()}
          >
            Try again
          </Button>
          <button
            type="button"
            className="w-full text-sm font-semibold text-muted-foreground"
            onClick={async () => {
              await signOut();
              router.replace("/login");
            }}
          >
            Sign out
          </button>
        </>
      )}
    </CompletionCard>
  );
}

function CompletionCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="container-shell grid min-h-[560px] place-items-center py-12">
      <Card className="w-full max-w-md p-7 text-center sm:p-9">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary-soft text-primary">
          <HeartPulse size={28} />
        </span>
        <h1 className="mt-6 text-2xl font-extrabold">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {description}
        </p>
        {children && <div className="mt-7 space-y-3 text-left">{children}</div>}
      </Card>
    </div>
  );
}

function oauthMessage(code: string) {
  if (code === "access_denied")
    return "Google access was cancelled. No account changes were made.";
  if (code === "oauth_provider_not_found")
    return "Google sign-in is not configured on the MediCare server.";
  return "Google could not verify the sign-in request. Please try again.";
}
