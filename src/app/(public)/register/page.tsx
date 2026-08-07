import type { Metadata } from "next";
import Link from "next/link";
import { AuthAside, AuthForm } from "@/features/auth/auth-form";
export const metadata: Metadata = { title: "Create Account" };
export default function Page() { return <div className="container-shell grid min-h-[800px] overflow-hidden rounded-[2rem] border border-border bg-surface shadow-xl lg:my-12 lg:grid-cols-[.9fr_1.1fr]"><AuthAside /><div className="flex items-center justify-center p-6 sm:p-12"><div className="w-full max-w-md"><p className="eyebrow">Join MediCare Connect</p><h1 className="mt-3 text-3xl font-extrabold">Create your care account</h1><p className="mt-2 text-sm text-muted-foreground">Already registered? <Link href="/login" className="font-bold text-primary">Sign in</Link></p><div className="mt-7"><AuthForm mode="register" /></div></div></div></div>; }
