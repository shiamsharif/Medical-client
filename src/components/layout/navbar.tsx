"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDown, LayoutDashboard, LogOut, Menu, UserRound, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/common/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const links = [{ href: "/", label: "Home" }, { href: "/doctors", label: "Find Doctors" }, { href: "/about", label: "About Us" }, { href: "/contact", label: "Contact Us" }];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { data: session } = useSession();
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const user = session?.user;

  return (
    <header className={cn("sticky top-0 z-50 border-b border-transparent bg-background/90 backdrop-blur-xl transition", scrolled && "border-border shadow-sm")}>
      <div className="container-shell flex h-18 items-center justify-between gap-4">
        <Logo />
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {links.map((link) => <Link key={link.href} href={link.href} className={cn("rounded-lg px-4 py-2 text-sm font-semibold text-muted-foreground transition hover:text-primary", pathname === link.href && "bg-primary-soft text-primary")}>{link.label}</Link>)}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          <ThemeToggle />
          {user ? (
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild><Button variant="outline"><span className="grid size-7 place-items-center rounded-full bg-primary-soft text-primary"><UserRound size={15} /></span>{user.name}<ChevronDown size={15} /></Button></DropdownMenu.Trigger>
              <DropdownMenu.Portal><DropdownMenu.Content align="end" className="z-50 mt-2 w-64 rounded-2xl border border-border bg-surface p-2 shadow-xl">
                <div className="border-b border-border px-3 py-3"><p className="font-bold">{user.name}</p><p className="truncate text-xs text-muted-foreground">{user.email}</p></div>
                <DropdownMenu.Item asChild><Link className="flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2.5 text-sm outline-none hover:bg-muted" href="/dashboard/profile"><UserRound size={17} /> Profile</Link></DropdownMenu.Item>
                <DropdownMenu.Item asChild><Link className="flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2.5 text-sm outline-none hover:bg-muted" href="/dashboard"><LayoutDashboard size={17} /> Dashboard</Link></DropdownMenu.Item>
                <DropdownMenu.Item className="flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-danger outline-none hover:bg-muted" onSelect={async () => { await signOut(); router.push("/"); }}><LogOut size={17} /> Logout</DropdownMenu.Item>
              </DropdownMenu.Content></DropdownMenu.Portal>
            </DropdownMenu.Root>
          ) : <><Button variant="ghost" asChild><Link href="/login">Login</Link></Button><Button asChild><Link href="/register">Create account</Link></Button></>}
        </div>
        <Button className="lg:hidden" size="icon" variant="ghost" aria-label="Toggle navigation" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</Button>
      </div>
      {open && <nav className="container-shell border-t border-border py-4 lg:hidden" aria-label="Mobile navigation"><div className="grid gap-1">{links.map((link) => <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 font-semibold hover:bg-muted">{link.label}</Link>)}<Link href="/dashboard" className="rounded-xl px-4 py-3 font-semibold hover:bg-muted">Dashboard</Link><div className="mt-2 flex gap-2 border-t border-border pt-4"><Button className="flex-1" variant="outline" asChild><Link href="/login">Login</Link></Button><Button className="flex-1" asChild><Link href="/register">Register</Link></Button><ThemeToggle /></div></div></nav>}
    </header>
  );
}
