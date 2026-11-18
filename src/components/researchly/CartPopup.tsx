import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, ShoppingCart, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { fieldByKey, formatINR } from "@/lib/catalog";
import { KindBadge } from "./KindBadge";

export function CartPopup() {
  const { items, total, remove, popupOpen, setPopupOpen } = useCart();
  const navigate = useNavigate();

  const go = (to: "/selected" | "/checkout") => {
    setPopupOpen(false);
    navigate({ to });
  };

  return (
    <Dialog open={popupOpen} onOpenChange={setPopupOpen}>
      <DialogContent className="max-w-lg gap-0 overflow-hidden p-0">
        <DialogHeader className="border-b border-border bg-paper-deep px-6 py-5 text-left">
          <DialogTitle className="flex items-center gap-2 font-display text-2xl">
            <ShoppingCart className="size-5" /> Your cart
          </DialogTitle>
          <DialogDescription>
            {items.length === 0
              ? "Nothing here yet — pick a research project or course."
              : `${items.length} item${items.length === 1 ? "" : "s"} selected`}
          </DialogDescription>
        </DialogHeader>

        {items.length > 0 && (
          <ul className="max-h-[50vh] divide-y divide-border overflow-y-auto px-6">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-3 py-3">
                <img
                  src={fieldByKey(item.field).image}
                  alt=""
                  width={56}
                  height={56}
                  className="size-14 shrink-0 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <KindBadge kind={item.kind} className="mb-1" />
                  <p className="truncate text-sm font-semibold">{item.title}</p>
                </div>
                <span className="text-sm font-semibold tabular-nums">{formatINR(item.price)}</span>
                <button
                  type="button"
                  onClick={() => remove(item.id)}
                  aria-label={`Remove ${item.title}`}
                  className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="space-y-4 border-t border-border bg-card px-6 py-5">
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-muted-foreground">Total</span>
            <span className="font-display text-3xl font-semibold tabular-nums">{formatINR(total)}</span>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button variant="outline" size="xl" className="flex-1" onClick={() => go("/selected")}>
              View selection
            </Button>
            <Button
              variant="research"
              size="xl"
              className="flex-1"
              disabled={items.length === 0}
              onClick={() => go("/checkout")}
            >
              Click &amp; pay <ArrowRight />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
