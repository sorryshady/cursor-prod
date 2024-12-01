"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";

interface LogoutButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

export function LogoutButton({
  className,
  children,
  ...props
}: LogoutButtonProps) {
  const { logout } = useAuth();

  return (
    <Button
      variant="default"
      className={cn("w-full justify-center", className)}
      onClick={() => logout()}
      {...props}
    >
      {children}
    </Button>
  );
}
