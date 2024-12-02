"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LogOut, User, Shield } from "lucide-react";
import { LogoutButton } from "./logout-button";

interface UserDropdownProps {
  user: {
    name: string;
    photoUrl?: string | null;
    userRole?: string;
  };
  setModelOpen?: (open: boolean) => void;
  align?: "start" | "center" | "end";
}

export function UserDropdown({
  user,
  align = "end",
  setModelOpen,
}: UserDropdownProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const clickHandler = () => {
    setOpen(false);
    if (setModelOpen) {
      setTimeout(() => {
        setModelOpen(false);
      }, 300);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className="cursor-pointer">
        <div className="flex items-center gap-2">
          <Avatar className="w-12 h-12 cursor-pointer lg:block hidden">
            <AvatarImage src={user.photoUrl || ""} />
            <AvatarFallback className="bg-black text-white">
              {user.name?.[0]}
              {user.name?.[1]}
            </AvatarFallback>
          </Avatar>
          <span className="lg:hidden">Welcome, {user.name}</span>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-60 z-[1000] mr-4" align={align}>
        <div className="flex flex-col gap-5">
          <Button
            variant="ghost"
            onClick={() => {
              router.push("/dashboard");
              clickHandler();
            }}
            className="flex items-center gap-2"
          >
            <User />
            Account
          </Button>
          {user.userRole === "ADMIN" && (
            <Button
              variant="ghost"
              onClick={() => {
                router.push("/admin");
                clickHandler();
              }}
              className="flex items-center gap-2"
            >
              <Shield />
              Admin
            </Button>
          )}
          <LogoutButton
            className="w-full bg-black hover:bg-black/90 flex items-center gap-2"
            clickHandler={clickHandler}
          >
            <LogOut /> Logout
          </LogoutButton>
        </div>
      </PopoverContent>
    </Popover>
  );
}
