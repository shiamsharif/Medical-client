import { cn } from "@/lib/utils";

export function SectionHeading({ eyebrow, title, description, centered = true, className }: { eyebrow: string; title: string; description?: string; centered?: boolean; className?: string }) {
  return <div className={cn("mb-12 max-w-2xl", centered && "mx-auto text-center", className)}><p className="eyebrow">{eyebrow}</p><h2 className="mt-3 text-balance text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h2>{description && <p className="mt-4 leading-7 text-muted-foreground">{description}</p>}</div>;
}
