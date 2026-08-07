"use client";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) { return <main className="grid min-h-[70vh] place-items-center p-6"><div className="max-w-md text-center"><span className="mx-auto grid size-16 place-items-center rounded-2xl bg-red-50 text-danger dark:bg-red-950/30"><AlertCircle size={30} /></span><h1 className="mt-6 text-3xl font-extrabold">Something needs a second look</h1><p className="mt-3 leading-7 text-muted-foreground">We couldn’t finish loading this page. Your information is safe—please try again.</p><Button className="mt-6" onClick={reset}>Try again</Button></div></main>; }
