import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface FormMessageProps {
  type: "error" | "success";
  message: string;
}

export function FormMessage({ type, message }: FormMessageProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-md p-3 text-sm",
        type === "error" && "bg-destructive/15 text-destructive",
        type === "success" && "bg-green-500/15 text-green-500"
      )}
    >
      {type === "error" ? (
        <AlertCircle className="h-4 w-4" />
      ) : (
        <CheckCircle2 className="h-4 w-4" />
      )}
      {message}
    </div>
  );
} 
