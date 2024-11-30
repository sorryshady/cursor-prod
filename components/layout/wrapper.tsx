import { cn } from "@/lib/utils"

interface WrapperProps {
  children: React.ReactNode
  className?: string
  noPadding?: boolean // For cases where we don't want default padding
}

export function Wrapper({
  children,
  className,
  noPadding = false
}: WrapperProps) {
  return (
    <div
      className={cn(
        "mx-auto max-w-7xl",
        !noPadding && "px-4",
        className
      )}
    >
      {children}
    </div>
  )
} 
