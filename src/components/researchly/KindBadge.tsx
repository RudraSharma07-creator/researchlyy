import { BookOpen, FlaskConical } from "lucide-react";
import type { ItemKind } from "@/lib/catalog";
import { cn } from "@/lib/utils";

export function KindBadge({ kind, className }: { kind: ItemKind; className?: string }) {
  const research = kind === "research";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
        research ? "bg-research text-research-foreground" : "bg-course text-course-foreground",
        className,
      )}
    >
      {research ? <FlaskConical className="size-3" /> : <BookOpen className="size-3" />}
      {research ? "Research" : "Course"}
    </span>
  );
}
