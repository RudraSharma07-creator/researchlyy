import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartShapeButton } from "@/components/researchly/CartShapeButton";
import { ItemDetailSheet } from "@/components/researchly/ItemDetailSheet";
import { KindBadge } from "@/components/researchly/KindBadge";
import { useCart } from "@/lib/cart";
import { fieldByKey, formatINR, itemImage, type CatalogItem } from "@/lib/catalog";

export const Route = createFileRoute("/selected")({
  head: () => ({
    meta: [
      { title: "Your selection — Researchly" },
      { name: "description", content: "Review the research projects and courses you've selected on Researchly." },
      { property: "og:title", content: "Your selection — Researchly" },
      { property: "og:description", content: "Review your selected research projects and courses before you pay." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SelectedPage,
});

function SelectedPage() {
  const { items, total, count, remove, setPopupOpen } = useCart();
  const [open, setOpen] = useState<CatalogItem | null>(null);

  return (
    <main className="bg-notebook min-h-[calc(100vh-4rem)]">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Keep exploring
        </Link>
        <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">Your selection</h1>
        <p className="mt-2 text-muted-foreground">Everything you've picked so far. Open the cart when you're ready.</p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
          <section aria-label="Selected items" className="min-w-0">
            {items.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
                <p className="font-display text-2xl">Nothing selected yet</p>
                <p className="mt-2 text-muted-foreground">Browse research projects and courses to get started.</p>
                <Button asChild variant="ink" size="xl" className="mt-6">
                  <Link to="/">Explore programmes</Link>
                </Button>
              </div>
            ) : (
              <ul className="space-y-4">
                {items.map((item) => {
                  const field = fieldByKey(item.field);
                  return (
                    <li key={item.id} className="flex gap-4 overflow-hidden rounded-2xl border border-border bg-card p-3 shadow-card">
                      <button
                        type="button"
                        onClick={() => setOpen(item)}
                        className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl sm:h-28 sm:w-44"
                        aria-label={`Open details for ${item.title}`}
                      >
                        <img src={itemImage(item)} alt={field.label} width={960} height={688} loading="lazy" className="size-full object-cover" />
                      </button>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-center gap-2">
                          <KindBadge kind={item.kind} />
                          <span className="truncate text-xs text-muted-foreground">{field.label}</span>
                        </div>
                        <h2 className="mt-1.5 line-clamp-2 text-lg font-semibold leading-snug">{item.title}</h2>
                        <p className="text-xs text-muted-foreground">
                          {item.duration} · {item.mode}
                        </p>
                        <div className="mt-auto flex flex-wrap items-center justify-between gap-x-2 pt-2">
                          <span className="font-display text-xl font-semibold tabular-nums">{formatINR(item.price)}</span>
                          <div className="-mr-2 flex gap-1">
                            <Button variant="ghost" size="sm" onClick={() => setOpen(item)} aria-label={`Details for ${item.title}`}>
                              <Eye /> <span className="hidden sm:inline">Details</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="hover:bg-destructive/10 hover:text-destructive"
                              onClick={() => remove(item.id)}
                              aria-label={`Remove ${item.title}`}
                            >
                              <Trash2 /> <span className="hidden sm:inline">Remove</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="flex flex-col items-center rounded-3xl border border-border bg-card px-6 py-8 text-center shadow-lift">
              <p className="text-sm text-muted-foreground">
                {count} item{count === 1 ? "" : "s"} · total
              </p>
              <p className="font-display text-4xl font-semibold tabular-nums">{formatINR(total)}</p>
              <CartShapeButton count={count} onClick={() => setPopupOpen(true)} className="mt-6" />
              <p className="mt-3 text-xs text-muted-foreground">Tap the cart to review and pay</p>
            </div>
          </aside>
        </div>
      </div>
      <ItemDetailSheet item={open} onClose={() => setOpen(null)} />
    </main>
  );
}
