import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { buildOrderLines } from "@/lib/order-logic";

/** Saves the signed-in user's cart as an order. Prices are taken from the catalogue here, on the server. */
export const placeOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { ids: string[] }) =>
    z.object({ ids: z.array(z.string().min(1).max(100)).min(1).max(100) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { courses, research, total } = buildOrderLines(data.ids);
    if (courses.length === 0 && research.length === 0) throw new Error("Your cart has no valid items.");

    const order_id = crypto.randomUUID();
    const ordered_at = new Date().toISOString();
    const withOwner = <T extends object>(rows: T[]) =>
      rows.map((r) => ({ ...r, order_id, ordered_at, user_id: context.userId }));

    // Browsers can't insert into these tables, so prices can't be forged; the caller is verified above.
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    if (courses.length) {
      const { error } = await supabaseAdmin.from("courses").insert(withOwner(courses));
      if (error) throw new Error("Could not save your order. Please try again.");
    }
    if (research.length) {
      const { error } = await supabaseAdmin.from("research").insert(withOwner(research));
      if (error) {
        await supabaseAdmin.from("courses").delete().eq("order_id", order_id);
        throw new Error("Could not save your order. Please try again.");
      }
    }
    return { order_id, total };
  });
