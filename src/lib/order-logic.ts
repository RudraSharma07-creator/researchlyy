import { itemById } from "@/lib/catalog";

export type OrderLine = { item_id: string; item: string; price: number };

/**
 * Turns a cart into order rows split by table. Prices always come from the catalogue
 * (never from the browser); unknown ids and repeats are dropped.
 */
export function buildOrderLines(ids: readonly string[]) {
  const courses: OrderLine[] = [];
  const research: OrderLine[] = [];
  const seen = new Set<string>();
  for (const id of ids) {
    if (seen.has(id)) continue;
    const item = itemById(id);
    if (!item) continue;
    seen.add(id);
    (item.kind === "course" ? courses : research).push({ item_id: item.id, item: item.title, price: item.price });
  }
  const total = [...courses, ...research].reduce((sum, l) => sum + l.price, 0);
  return { courses, research, total };
}
