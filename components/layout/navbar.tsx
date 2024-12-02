"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
  SheetHeader,
} from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";
import { Separator } from "../ui/separator";
import { UserDropdown } from "../auth/user-dropdown";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/committee", label: "Committee" },
  { href: "/news", label: "News" },
  { href: "/events", label: "Events" },
  { href: "/gallery", label: "Gallery" },
  { href: "/downloads", label: "Downloads" },
  { href: "/news-letter", label: "News Letter" },
  { href: "/updates", label: "Updates" },
];

export function Navbar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#20333C] text-white p-4">
      <div className="mx-auto max-w-7xl px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 flex-[0.5]">
            <Image
              src="/aoek-logo.webp"
              alt="AOEK Logo"
              width={60}
              height={60}
            />
            <span className="text-2xl font-bold text-white tracking-wider">
              AOEK
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center lg:flex-[2] justify-around text-base font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "transition-colors hover:text-[#FACE30]",
                  pathname === link.href &&
                    "text-[#FACE30] underline underline-offset-4",
                )}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <UserDropdown user={user} align="center" />
            ) : (
              <Button
                asChild
                className="py-2 px-12 font-semibold shadow-md"
                variant="destructive"
              >
                <Link href="/login">Login</Link>
              </Button>
            )}
          </div>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button size="icon" variant="outline" className="bg-[#20333C]">
                <MenuIcon className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="bg-[#20333C] text-white pt-10 border-none overflow-auto"
            >
              <SheetHeader>
                <SheetTitle className="text-left w-full text-white mt-10 px-4">
                  Menu
                </SheetTitle>
                <Separator />
              </SheetHeader>
              <div className="flex flex-col gap-10 p-4 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => {
                      setTimeout(() => {
                        setIsOpen(false);
                      }, 300);
                    }}
                    className={cn(
                      "transition-colors hover:text-[#FACE30]",
                      pathname === link.href &&
                        "text-[#FACE30] underline underline-offset-4",
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                {user ? (
                  <UserDropdown user={user} align="start" />
                ) : (
                  <Button
                    asChild
                    className="py-2 px-12 font-semibold shadow-md"
                    variant="destructive"
                  >
                    <Link href="/login">Login</Link>
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
