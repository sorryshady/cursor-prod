"use client";

import { ChevronLeft } from "lucide-react";
import React from "react";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const BackButton = ({
  label,
  type = "white",
}: {
  label?: string;
  type?: "white" | "black";
}) => {
  const router = useRouter();
  return (
    <div className="absolute top-5 left-4 md:left-8 lg:left-12">
      <Button
        size="icon"
        className={cn(
          "h-10 w-10",
          type === "black"
            ? "bg-black text-white hover:bg-black/80"
            : "bg-white text-black hover:bg-white/80 ",
        )}
        onClick={() => router.back()}
        aria-label={label}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default BackButton;
