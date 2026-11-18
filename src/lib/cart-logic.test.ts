import { describe, expect, it } from "vitest";
import { addToSelection, removeFromSelection, selectionTotal } from "@/lib/cart-logic";

describe("selection rules", () => {
  it("lets a student select multiple items", () => {
    let ids: string[] = [];
    ids = addToSelection(ids, "r-exoplanet");
    ids = addToSelection(ids, "c-python-ai");
    expect(ids).toEqual(["r-exoplanet", "c-python-ai"]);
  });

  it("never adds the same item twice", () => {
    expect(addToSelection(["r-exoplanet"], "r-exoplanet")).toEqual(["r-exoplanet"]);
  });

  it("removes an item", () => {
    expect(removeFromSelection(["r-exoplanet", "c-python-ai"], "r-exoplanet")).toEqual(["c-python-ai"]);
  });

  it("totals the selected prices in rupees", () => {
    // ₹14,999 research + ₹5,999 course
    expect(selectionTotal(["r-exoplanet", "c-python-ai"])).toBe(20998);
  });
});
