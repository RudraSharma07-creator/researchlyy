import { itemById } from "@/lib/catalog";

/** Adds an item once; selecting the same item twice never duplicates it. */
export function addToSelection(ids: string[], id: string): string[] {
  if (!itemById(id) || ids.includes(id)) return ids;
  return [...ids, id];
}

export function removeFromSelection(ids: string[], id: string): string[] {
  return ids.filter((x) => x !== id);
}

/** Total in INR: the plain sum of each selected item's price. */
export function selectionTotal(ids: string[]): number {
  return ids.reduce((sum, id) => sum + (itemById(id)?.price ?? 0), 0);
}
