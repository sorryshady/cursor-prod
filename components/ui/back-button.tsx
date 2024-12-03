import { ChevronLeft } from "lucide-react";
import React from "react";
import { Button } from "./button";
import Link from "next/link";
import { cn } from "@/lib/utils";

const BackButton = ({
  href,
  label,
  type = "white",
}: {
  href: string;
  label?: string;
  type?: "white" | "black";
}) => {
  return (
    <div className="absolute top-5 left-4 md:left-8 lg:left-12">
      <Button
        asChild
        size="icon"
        className={cn(
          "h-10 w-10",
          type === "black"
            ? "bg-black text-white hover:bg-black/80"
            : "bg-white text-black hover:bg-white/80 ",
        )}
      >
        <Link href={href} aria-label={label}>
          <ChevronLeft className="h-6 w-6" />
        </Link>
      </Button>
    </div>
  );
};

export default BackButton;
