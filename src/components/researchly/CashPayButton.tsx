import { cn } from "@/lib/utils";

/** A big button drawn as a rupee banknote, with "Pay" written under it. */
export function CashPayButton({ onClick, amountLabel, className }: { onClick: () => void; amountLabel: string; className?: string }) {
  return (
    <button
      type="submit"
      onClick={onClick}
      aria-label={`Pay ${amountLabel}`}
      className={cn("group flex flex-col items-center gap-3 focus-visible:outline-none", className)}
    >
      <span className="relative block h-28 w-60">
        {/* stacked notes behind */}
        <span className="absolute inset-0 translate-x-2 translate-y-2 rotate-3 rounded-xl bg-cash-deep/60 transition-transform duration-300 group-hover:translate-x-3 group-hover:rotate-6" />
        <span className="absolute inset-0 translate-x-1 translate-y-1 rotate-1 rounded-xl bg-cash-deep/80 transition-transform duration-300 group-hover:rotate-3" />
        {/* front note */}
        <span className="bg-cash absolute inset-0 flex items-center justify-between overflow-hidden rounded-xl border-2 border-cash-deep px-4 text-cash-foreground shadow-lift transition-transform duration-300 group-hover:-translate-y-1 group-hover:-rotate-2 group-active:scale-95">
          <span className="pointer-events-none absolute inset-2 rounded-lg border border-dashed border-cash-deep/60" />
          <span className="font-display text-lg font-bold">₹</span>
          <span className="grid size-16 place-items-center rounded-full border-2 border-cash-deep/70 bg-cash-foreground/5">
            <span className="font-display text-3xl font-bold">₹</span>
          </span>
          <span className="font-display text-lg font-bold">₹</span>
          <span className="absolute bottom-2.5 left-1/2 -translate-x-1/2 text-[10px] font-semibold uppercase tracking-[0.25em] opacity-80">
            {amountLabel}
          </span>
        </span>
      </span>
      <span className="font-display text-2xl font-semibold tracking-tight group-hover:underline group-hover:underline-offset-4">
        Pay
      </span>
    </button>
  );
}
