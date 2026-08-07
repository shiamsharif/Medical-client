import Link from "next/link";
import { HeartPulse } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className={cn("inline-flex items-center gap-2.5 font-extrabold tracking-tight", light && "text-white")}>
      <span className="grid size-10 place-items-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20"><HeartPulse size={22} aria-hidden="true" /></span>
      <span>MediCare <span className={light ? "text-teal-300" : "text-primary"}>Connect</span></span>
    </Link>
  );
}
