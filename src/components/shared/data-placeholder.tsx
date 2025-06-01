import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlertTriangle, Info } from "lucide-react";

interface DataPlaceholderProps {
  state: 'loading' | 'error' | 'empty' | 'custom';
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
  children?: React.ReactNode; // For custom state content
  icon?: React.ElementType;
}

export function DataPlaceholder({ 
  state, 
  title, 
  message, 
  onRetry, 
  className,
  children,
  icon: CustomIcon
}: DataPlaceholderProps) {
  const baseClasses = cn("flex flex-col items-center justify-center p-8 border border-dashed rounded-[1rem] min-h-[200px] text-center bg-card", className);

  if (state === 'loading') {
    return (
      <div className={baseClasses}>
        <Skeleton className="h-12 w-12 rounded-full mb-4" />
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    );
  }

  if (state === 'error') {
    const Icon = CustomIcon || AlertTriangle;
    return (
      <Alert variant="destructive" className={cn(baseClasses, "border-destructive/50")}>
        <Icon className="h-6 w-6 text-destructive" />
        <AlertTitle className="mt-2 text-lg font-semibold">{title || "Error Loading Data"}</AlertTitle>
        <AlertDescription className="mt-1 text-sm">
          {message || "Something went wrong. Please try again."}
        </AlertDescription>
        {onRetry && (
          <Button onClick={onRetry} variant="destructive" className="mt-4">
            Retry
          </Button>
        )}
      </Alert>
    );
  }

  if (state === 'empty') {
    const Icon = CustomIcon || Info;
    return (
      <div className={baseClasses}>
        <Icon className="h-10 w-10 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold text-foreground">{title || "No Data Available"}</h3>
        {message && <p className="text-sm text-muted-foreground mt-1">{message}</p>}
      </div>
    );
  }
  
  if (state === 'custom' && children) {
    return <div className={baseClasses}>{children}</div>;
  }

  return null;
}
