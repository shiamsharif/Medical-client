"use client";

import { Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(() => () => undefined, () => true, () => false);
  if (!mounted) return <span className="block size-11" />;
  const next = theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
  const Icon = theme === "light" ? Sun : theme === "dark" ? Moon : Laptop;
  return <Button variant="ghost" size="icon" aria-label={`Theme: ${theme}. Switch to ${next}`} onClick={() => setTheme(next)}><Icon size={19} /></Button>;
}
