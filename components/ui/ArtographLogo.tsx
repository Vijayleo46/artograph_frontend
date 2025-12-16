import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

export function ArtographLogo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center justify-center h-8 w-8 rounded bg-blue-600">
        <Sparkles className="h-5 w-5 text-white" />
      </div>
      <span className="text-lg font-bold tracking-tight text-foreground">AI Assignments</span>
    </div>
  );
}
