"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, HeartPulse } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/core";
import { signIn, signUp } from "@/lib/auth-client";
import {
  loginSchema,
  registerSchema,
  type LoginValues,
  type RegisterValues,
} from "@/schemas/auth";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  return mode === "login" ? <LoginForm /> : <RegisterForm />;
}

function LoginForm() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });
  const submit = handleSubmit(async (values) => {
    const result = await signIn.email(values);
    if (result.error) {
      setError("root", {
        message: result.error.message ?? "Unable to sign in",
      });
      return;
    }
    toast.success("Welcome back");
    router.replace("/auth/complete");
  });
  return (
    <form onSubmit={submit} className="space-y-5" noValidate>
      <Field label="Email address" error={errors.email?.message}>
        <Input
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          {...register("email")}
        />
      </Field>
      <Field label="Password" error={errors.password?.message}>
        <div className="relative">
          <Input
            type={show ? "text" : "password"}
            autoComplete="current-password"
            className="pr-11"
            {...register("password")}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            onClick={() => setShow(!show)}
            aria-label={show ? "Hide password" : "Show password"}
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </Field>
      <div className="flex justify-end">
        <Link
          href="/forgot-password"
          className="text-sm font-semibold text-primary"
        >
          Forgot password?
        </Link>
      </div>
      {errors.root && (
        <p
          role="alert"
          className="rounded-xl bg-red-50 p-3 text-sm text-danger dark:bg-red-950/30"
        >
          {errors.root.message}
        </p>
      )}
      <Button className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Signing in…" : "Sign in securely"}
      </Button>
      <SocialButton label="Continue with Google" />
    </form>
  );
}

function RegisterForm() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "patient", accept: false },
  });
  const role = useWatch({ control, name: "role" });
  const submit = handleSubmit(
    async ({ name, email, password, role: selectedRole }) => {
      const result = await signUp.email({ name, email, password });
      if (result.error) {
        setError("root", {
          message: result.error.message ?? "Unable to create your account",
        });
        return;
      }
      toast.success("Your secure account was created");
      router.replace(`/auth/complete?role=${selectedRole}`);
    },
  );
  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <Field label="Full name" error={errors.name?.message}>
        <Input
          autoComplete="name"
          placeholder="Your full name"
          {...register("name")}
        />
      </Field>
      <Field label="Email address" error={errors.email?.message}>
        <Input
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          {...register("email")}
        />
      </Field>
      <Field label="I am registering as" error={errors.role?.message}>
        <Select {...register("role")}>
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
        </Select>
      </Field>
      <Field label="Password" error={errors.password?.message}>
        <div className="relative">
          <Input
            type={show ? "text" : "password"}
            autoComplete="new-password"
            className="pr-11"
            {...register("password")}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            onClick={() => setShow(!show)}
            aria-label={show ? "Hide password" : "Show password"}
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          8+ characters, including a number and a special character.
        </p>
      </Field>
      <label className="flex gap-3 text-sm text-muted-foreground">
        <input
          type="checkbox"
          className="mt-1 accent-primary"
          {...register("accept")}
        />
        <span>
          I agree to the{" "}
          <Link className="font-semibold text-primary" href="#">
            Terms
          </Link>{" "}
          and{" "}
          <Link className="font-semibold text-primary" href="#">
            Privacy Policy
          </Link>
          .
        </span>
      </label>
      {errors.accept && (
        <p role="alert" className="text-sm text-danger">
          {errors.accept.message}
        </p>
      )}
      {errors.root && (
        <p
          role="alert"
          className="rounded-xl bg-red-50 p-3 text-sm text-danger dark:bg-red-950/30"
        >
          {errors.root.message}
        </p>
      )}
      <Button className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Creating account…" : "Create account"}
      </Button>
      <SocialButton label="Sign up with Google" role={role} />
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label>{label}</Label>
      {children}
      {error && (
        <p className="mt-1.5 text-sm text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
function SocialButton({
  label,
  role,
}: {
  label: string;
  role?: "patient" | "doctor";
}) {
  const [isStarting, setIsStarting] = useState(false);
  const startGoogleAuth = async () => {
    setIsStarting(true);
    const completionURL = new URL("/auth/complete", window.location.origin);
    if (role) completionURL.searchParams.set("role", role);
    try {
      const result = await signIn.social({
        provider: "google",
        callbackURL: completionURL.toString(),
        newUserCallbackURL: completionURL.toString(),
        errorCallbackURL: completionURL.toString(),
      });
      if (result.error) {
        const notConfigured = result.error.message
          ?.toLowerCase()
          .includes("provider not found");
        toast.error(
          notConfigured
            ? "Google sign-in is not configured on the server yet."
            : (result.error.message ?? "Unable to start Google sign-in"),
        );
      }
    } catch {
      toast.error("Unable to reach Google sign-in. Please try again.");
    } finally {
      setIsStarting(false);
    }
  };
  return (
    <>
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        OR
        <span className="h-px flex-1 bg-border" />
      </div>
      <Button
        className="w-full"
        type="button"
        variant="outline"
        disabled={isStarting}
        onClick={startGoogleAuth}
      >
        <span className="grid size-6 place-items-center rounded-full bg-white font-extrabold text-blue-600 shadow-sm">
          G
        </span>
        {isStarting ? "Connecting to Google…" : label}
      </Button>
    </>
  );
}

export function AuthAside() {
  return (
    <div className="hidden bg-[#0b4743] p-12 text-white lg:flex lg:flex-col lg:justify-between">
      <div>
        <span className="grid size-14 place-items-center rounded-2xl bg-white/10">
          <HeartPulse size={28} />
        </span>
        <h2 className="mt-8 text-4xl font-extrabold leading-tight">
          Your healthcare journey, beautifully organized.
        </h2>
        <p className="mt-5 leading-7 text-teal-50/70">
          One secure account for appointments, payments, favorites, reviews, and
          prescriptions.
        </p>
      </div>
      <div className="rounded-2xl bg-white/8 p-5">
        <p className="text-sm leading-6 text-teal-50/80">
          “Booking the right specialist no longer feels like a full-time job.”
        </p>
        <p className="mt-3 text-sm font-bold">— A MediCare Connect patient</p>
      </div>
    </div>
  );
}
