import { cn } from "@/lib/utils";

interface PasswordStrengthProps {
  password: string;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const strength = Object.values(checks).filter(Boolean).length;

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={cn(
              "h-2 w-full rounded-full",
              level <= strength
                ? {
                    1: "bg-red-500",
                    2: "bg-orange-500",
                    3: "bg-yellow-500",
                    4: "bg-green-500",
                    5: "bg-green-600",
                  }[strength]
                : "bg-muted"
            )}
          />
        ))}
      </div>
      <div className="text-sm space-y-1">
        <div className={cn("text-muted-foreground", checks.length && "text-green-500")}>
          ✓ At least 8 characters
        </div>
        <div className={cn("text-muted-foreground", checks.uppercase && "text-green-500")}>
          ✓ At least one uppercase letter
        </div>
        <div className={cn("text-muted-foreground", checks.lowercase && "text-green-500")}>
          ✓ At least one lowercase letter
        </div>
        <div className={cn("text-muted-foreground", checks.number && "text-green-500")}>
          ✓ At least one number
        </div>
        <div className={cn("text-muted-foreground", checks.special && "text-green-500")}>
          ✓ At least one special character
        </div>
      </div>
    </div>
  );
} 
