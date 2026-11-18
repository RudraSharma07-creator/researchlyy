import { cn } from "@/lib/utils";

/** A big button drawn in the shape of a shopping cart, with "Cart" written under it. */
export function CartShapeButton({ count, onClick, className }: { count: number; onClick: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}
      className={cn("group flex flex-col items-center gap-2 focus-visible:outline-none", className)}
    >
      <svg
        viewBox="0 0 200 160"
        className="w-44 drop-shadow-xl transition-transform duration-300 group-hover:-translate-y-1 group-hover:-rotate-2 group-active:scale-95"
        aria-hidden
      >
        {/* handle */}
        <path d="M8 22 H38 L46 40" fill="none" className="stroke-ink" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
        {/* basket */}
        <path d="M44 38 H186 L168 104 H62 Z" className="fill-ink" strokeLinejoin="round" />
        {/* basket grid */}
        <g className="stroke-ink-foreground/25" strokeWidth="3">
          <path d="M60 60 H180 M64 82 H174" />
          <path d="M90 40 L96 102 M128 40 L128 102 M160 40 L152 102" />
        </g>
        {/* base */}
        <path d="M62 104 L56 124 H170" fill="none" className="stroke-ink" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
        {/* wheels */}
        <circle cx="76" cy="142" r="12" className="fill-research stroke-ink" strokeWidth="6" />
        <circle cx="154" cy="142" r="12" className="fill-research stroke-ink" strokeWidth="6" />
        {/* count bubble */}
        <circle cx="115" cy="71" r="22" className="fill-research" />
        <text x="115" y="79" textAnchor="middle" className="fill-research-foreground font-display" fontSize="24" fontWeight="700">
          {count}
        </text>
      </svg>
      <span className="font-display text-2xl font-semibold tracking-tight group-hover:underline group-hover:underline-offset-4">
        Cart
      </span>
    </button>
  );
}
