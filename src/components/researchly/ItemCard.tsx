import { Check, Clock, Eye, GraduationCap, Plus } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { fieldByKey, formatINR, type CatalogItem } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import { KindBadge } from "./KindBadge";

export function ItemCard({ item, onOpen }: { item: CatalogItem; onOpen: (item: CatalogItem) => void }) {
  const { has, toggle } = useCart();
  const field = fieldByKey(item.field);
  const selected = has(item.id);
  const research = item.kind === "research";

  return (
    <HoverCard openDelay={250} closeDelay={80}>
      <HoverCardTrigger asChild>
        <article
          className={cn(
            "group flex flex-col overflow-hidden rounded-2xl border bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift",
            selected ? (research ? "border-research ring-2 ring-research/40" : "border-course ring-2 ring-course/40") : "border-border",
          )}
        >
          <button
            type="button"
            onClick={() => onOpen(item)}
            className="relative aspect-[4/3] overflow-hidden text-left"
            aria-label={`Open details for ${item.title}`}
          >
            <img
              src={field.image}
              alt={field.label}
              loading="lazy"
              width={960}
              height={688}
              className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <span className="bg-scrim absolute inset-0" />
            <KindBadge kind={item.kind} className="absolute left-3 top-3" />
            {selected && (
              <span className="absolute right-3 top-3 grid size-7 place-items-center rounded-full bg-card text-foreground shadow">
                <Check className="size-4" />
              </span>
            )}
            <span className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-2 text-ink-foreground">
              <span className="text-xs font-semibold uppercase tracking-wider opacity-90">{field.label}</span>
              <span className="flex items-center gap-1 rounded-full bg-ink-foreground/15 px-2.5 py-1 text-xs font-medium opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
                <Eye className="size-3.5" /> Details
              </span>
            </span>
          </button>

          <div className="flex flex-1 flex-col gap-3 p-4">
            <h3 className="line-clamp-2 text-lg font-semibold leading-snug">{item.title}</h3>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="size-3.5" /> {item.duration}
              </span>
              <span className="flex items-center gap-1">
                <GraduationCap className="size-3.5" /> {item.level}
              </span>
            </div>
            <div className="mt-auto flex items-center justify-between gap-2 pt-1">
              <span className="font-display text-xl font-semibold tabular-nums">{formatINR(item.price)}</span>
              <Button
                size="pill"
                variant={selected ? "added" : research ? "research" : "course"}
                onClick={() => toggle(item.id)}
                aria-pressed={selected}
              >
                {selected ? (
                  <>
                    <Check /> Added
                  </>
                ) : (
                  <>
                    <Plus /> Select
                  </>
                )}
              </Button>
            </div>
          </div>
        </article>
      </HoverCardTrigger>
      <HoverCardContent side="top" align="center" sideOffset={8} className="hidden w-80 rounded-xl border-border p-4 md:block">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Quick look</p>
        <p className="mt-1 text-sm leading-relaxed">{item.summary}</p>
        <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Benefits</p>
        <ul className="mt-1.5 space-y-1.5">
          {item.benefits.map((b) => (
            <li key={b} className="flex gap-2 text-sm">
              <span className={cn("mt-1.5 size-1.5 shrink-0 rounded-full", research ? "bg-research" : "bg-course")} />
              {b}
            </li>
          ))}
        </ul>
      </HoverCardContent>
    </HoverCard>
  );
}
