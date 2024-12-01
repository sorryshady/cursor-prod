import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

export function PageHeader({
  title,
  description,
  className,
  titleClassName,
  descriptionClassName
}: PageHeaderProps) {
  return (
    <div className={cn("space-y-2 text-center", className)}>
      <h1 className={cn(
        "text-3xl font-bold tracking-tight",
        "dark:text-white text-foreground",
        titleClassName
      )}>
        {title}
      </h1>
      {description && (
        <p className={cn(
          "text-muted-foreground",
          "dark:text-gray-300",
          descriptionClassName
        )}>
          {description}
        </p>
      )}
    </div>
  );
}
