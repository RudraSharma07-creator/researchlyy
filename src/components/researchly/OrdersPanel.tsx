import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Receipt } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { formatINR, itemById, itemImage, type ItemKind } from "@/lib/catalog";
import { KindBadge } from "./KindBadge";

type OrderRow = {
  id: string;
  order_id: string;
  item_id: string;
  item: string;
  price: number;
  ordered_at: string;
  kind: ItemKind;
};

const COLUMNS = "id, order_id, item_id, item, price, ordered_at";

async function fetchOrders(): Promise<OrderRow[]> {
  // Row-level security returns only the signed-in user's own rows.
  const [courses, research] = await Promise.all([
    supabase.from("courses").select(COLUMNS),
    supabase.from("research").select(COLUMNS),
  ]);
  if (courses.error) throw courses.error;
  if (research.error) throw research.error;
  return [
    ...courses.data.map((r) => ({ ...r, kind: "course" as const })),
    ...research.data.map((r) => ({ ...r, kind: "research" as const })),
  ].sort((a, b) => b.ordered_at.localeCompare(a.ordered_at));
}

/** The signed-in student's own orders, with a way to cancel an item. */
export function OrdersPanel() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [confirming, setConfirming] = useState<string | null>(null);

  const { data: rows = [], isLoading, isError } = useQuery({
    queryKey: ["orders", user?.id],
    queryFn: fetchOrders,
    enabled: Boolean(user),
  });

  const cancel = useMutation({
    mutationFn: async (row: OrderRow) => {
      const table = row.kind === "course" ? "courses" : "research";
      const { data, error } = await supabase.from(table).delete().eq("id", row.id).select("id");
      if (error) throw error;
      if (!data?.length) throw new Error("This item could not be cancelled.");
    },
    onSuccess: (_d, row) => {
      toast.success(`Cancelled "${row.item}"`);
      setConfirming(null);
      void queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Could not cancel this item."),
  });

  if (!user) return null;

  const groups = new Map<string, OrderRow[]>();
  for (const r of rows) groups.set(r.order_id, [...(groups.get(r.order_id) ?? []), r]);

  return (
    <section aria-labelledby="orders-heading" className="rounded-3xl border border-border bg-card p-6 shadow-card">
      <h2 id="orders-heading" className="flex items-center gap-2 text-2xl font-semibold">
        <Receipt className="size-5" /> Your orders
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">Only you can see these.</p>

      {isLoading ? (
        <p className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Loading your orders…
        </p>
      ) : isError ? (
        <p className="mt-6 text-sm text-destructive">We couldn't load your orders. Please refresh.</p>
      ) : rows.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">No orders yet. Items you buy will show up here.</p>
      ) : (
        <div className="mt-5 space-y-5">
          {[...groups.entries()].map(([orderId, items]) => (
            <div key={orderId} className="overflow-hidden rounded-2xl border border-border">
              <div className="flex items-baseline justify-between bg-paper-deep px-4 py-2.5 text-xs text-muted-foreground">
                <span>
                  Ordered{" "}
                  {new Date(items[0]!.ordered_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                </span>
                <span className="font-semibold tabular-nums text-foreground">
                  {formatINR(items.reduce((s, r) => s + r.price, 0))}
                </span>
              </div>
              <ul className="divide-y divide-border">
                {items.map((row) => {
                  const cat = itemById(row.item_id);
                  return (
                    <li key={row.id} className="flex flex-wrap items-center gap-3 p-3">
                      {cat && (
                        <img
                          src={itemImage(cat)}
                          alt=""
                          width={48}
                          height={48}
                          loading="lazy"
                          className="size-12 shrink-0 rounded-lg object-cover"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <KindBadge kind={row.kind} />
                        <p className="mt-0.5 truncate text-sm font-semibold">{row.item}</p>
                      </div>
                      <span className="text-sm font-semibold tabular-nums">{formatINR(row.price)}</span>
                      {confirming === row.id ? (
                        <span className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="destructive"
                            disabled={cancel.isPending}
                            onClick={() => cancel.mutate(row)}
                          >
                            {cancel.isPending && <Loader2 className="animate-spin" />} Yes, cancel
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => setConfirming(null)}>
                            Keep
                          </Button>
                        </span>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => setConfirming(row.id)}>
                          Cancel
                        </Button>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
