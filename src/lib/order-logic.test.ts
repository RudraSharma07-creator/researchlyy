import { describe, expect, it } from "vitest";
import { buildOrderLines } from "@/lib/order-logic";

describe("order rows", () => {
  it("puts courses in the courses table and research in the research table", () => {
    const { courses, research } = buildOrderLines(["r-exoplanet", "c-python-ai"]);
    expect(courses.map((l) => l.item_id)).toEqual(["c-python-ai"]);
    expect(research.map((l) => l.item_id)).toEqual(["r-exoplanet"]);
  });

  it("uses catalogue prices in rupees", () => {
    const { courses, research, total } = buildOrderLines(["r-exoplanet", "c-python-ai"]);
    expect(research[0]?.price).toBe(14999);
    expect(courses[0]?.price).toBe(5999);
    expect(total).toBe(20998);
  });

  it("ignores unknown items and never saves the same item twice", () => {
    const { courses, research } = buildOrderLines(["c-python-ai", "c-python-ai", "made-up"]);
    expect(courses).toHaveLength(1);
    expect(research).toHaveLength(0);
  });
});
