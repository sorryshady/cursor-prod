"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";

interface LogoutButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  clickHandler?: () => void;
}

export function LogoutButton({
  className,
  children,
  clickHandler,
  ...props
}: LogoutButtonProps) {
  const { logout } = useAuth();

  return (
    <Button
      variant="default"
      className={cn("w-full justify-center", className)}
      onClick={() => {
        if (clickHandler) {
          clickHandler();
        }
        logout();
      }}
      {...props}
    >
      {children}
    </Button>
  );
}
