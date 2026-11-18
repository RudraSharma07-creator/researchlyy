import { Check, CheckCircle2, Clock, GraduationCap, MonitorPlay, Plus, Sparkles } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { fieldByKey, formatINR, type CatalogItem } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import { KindBadge } from "./KindBadge";

export function ItemDetailSheet({ item, onClose }: { item: CatalogItem | null; onClose: () => void }) {
  const { has, toggle } = useCart();

  return (
    <Sheet open={Boolean(item)} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-md">
        {item && <SheetBody item={item} selected={has(item.id)} onToggle={() => toggle(item.id)} />}
      </SheetContent>
    </Sheet>
  );
}

function SheetBody({ item, selected, onToggle }: { item: CatalogItem; selected: boolean; onToggle: () => void }) {
  const field = fieldByKey(item.field);
  const research = item.kind === "research";
  const dot = research ? "text-research" : "text-course";

  return (
    <>
      <div className="relative h-52 shrink-0">
        <img src={field.image} alt={field.label} width={960} height={688} className="size-full object-cover" />
        <span className="bg-scrim absolute inset-0" />
        <div className="absolute inset-x-6 bottom-4 flex items-center gap-2">
          <KindBadge kind={item.kind} />
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-foreground">{field.label}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5">
        <SheetHeader className="space-y-2 text-left">
          <SheetTitle className="font-display text-2xl leading-tight">{item.title}</SheetTitle>
          <SheetDescription className="text-base leading-relaxed text-foreground/80">{item.details}</SheetDescription>
        </SheetHeader>

        <dl className="mt-5 grid grid-cols-3 gap-2 text-center">
          {[
            { icon: Clock, label: "Duration", value: item.duration },
            { icon: MonitorPlay, label: "Format", value: item.mode },
            { icon: GraduationCap, label: "For", value: item.level },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-xl border border-border bg-muted/60 px-2 py-3">
              <Icon className="mx-auto size-4 text-muted-foreground" />
              <dt className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</dt>
              <dd className="mt-0.5 text-xs font-semibold leading-tight">{value}</dd>
            </div>
          ))}
        </dl>

        <h4 className="mt-6 text-sm font-semibold uppercase tracking-wider text-muted-foreground">What's included</h4>
        <ul className="mt-2 space-y-2">
          {item.includes.map((x) => (
            <li key={x} className="flex gap-2.5 text-sm">
              <CheckCircle2 className={cn("mt-0.5 size-4 shrink-0", dot)} />
              {x}
            </li>
          ))}
        </ul>

        <h4 className="mt-6 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Benefits</h4>
        <ul className="mt-2 space-y-2">
          {item.benefits.map((x) => (
            <li key={x} className="flex gap-2.5 text-sm">
              <Sparkles className={cn("mt-0.5 size-4 shrink-0", dot)} />
              {x}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-border bg-card px-6 py-4">
        <div>
          <p className="text-xs text-muted-foreground">Price</p>
          <p className="font-display text-2xl font-semibold tabular-nums">{formatINR(item.price)}</p>
        </div>
        <Button size="xl" variant={selected ? "added" : research ? "research" : "course"} onClick={onToggle}>
          {selected ? (
            <>
              <Check /> Added to cart
            </>
          ) : (
            <>
              <Plus /> Add to cart
            </>
          )}
        </Button>
      </div>
    </>
  );
}
