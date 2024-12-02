"use client";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
interface FormMessageProps {
  type: "error" | "success";
  message: string;
  visible?: boolean;
  requestId?: string;
}

export function FormMessage({
  type,
  message,
  visible,
  requestId,
}: FormMessageProps) {
  const router = useRouter();
  const clickHandler = async () => {
    if (requestId) {
      await fetch(`/api/user/request?requestId=${requestId}`, {
        method: "PATCH",
      });
    }
    router.refresh();
  };
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-md p-3 text-sm w-full",
        type === "error" && "bg-destructive/15 text-destructive",
        type === "success" && "bg-emerald-500/15 text-emerald-500",
      )}
    >
      {type === "error" ? (
        <AlertCircle className="h-4 w-4" />
      ) : (
        <CheckCircle2 className="h-4 w-4" />
      )}
      <p>{message}</p>
      {visible && (
        <Button
          className={cn(
            "ml-auto",
            type === "error" ? "bg-destructive" : "bg-emerald-500",
          )}
          size={"icon"}
          onClick={clickHandler}
        >
          <X />
        </Button>
      )}
    </div>
  );
}
