import type { Metadata } from "next";
import Link from "next/link";
import { AuthAside, AuthForm } from "@/features/auth/auth-form";
export const metadata: Metadata = { title: "Login" };
export default function Page() { return <div className="container-shell grid min-h-[720px] overflow-hidden rounded-[2rem] border border-border bg-surface shadow-xl lg:my-12 lg:grid-cols-[.9fr_1.1fr]"><AuthAside /><div className="flex items-center justify-center p-6 sm:p-12"><div className="w-full max-w-md"><p className="eyebrow">Welcome back</p><h1 className="mt-3 text-3xl font-extrabold">Sign in to your account</h1><p className="mt-2 text-sm text-muted-foreground">New to MediCare Connect? <Link href="/register" className="font-bold text-primary">Create an account</Link></p><div className="mt-8"><AuthForm mode="login" /></div></div></div></div>; }
