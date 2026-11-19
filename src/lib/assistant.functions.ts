import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { GatewayError, generateResponse } from "@lovable.dev/ai-gateway";
import { CATALOG, fieldByKey, formatINR } from "@/lib/catalog";

const FRIENDLY =
  "Sorry, I can't answer right now. Please try again in a moment — you can still browse every programme on this page.";
const BUSY = "Lots of students are asking right now. Please try again in a minute.";

const inputSchema = z.object({
  messages: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().trim().min(1).max(1500) }))
    .min(1)
    .max(12)
    .refine((m) => m[m.length - 1]?.role === "user", "The last message must be the student's question."),
});

export type AssistantReply = { ok: true; answer: string } | { ok: false; message: string };

/**
 * Researchly's AI helper. Never throws to the browser: any failure becomes a friendly message.
 * Authentication is handled by the AI SDK from the server environment — no key lives in code.
 */
export const askAssistant = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => inputSchema.parse(input))
  .handler(async ({ data }): Promise<AssistantReply> => {
    const catalogue = CATALOG.map(
      (i) =>
        `- [${i.kind}] ${i.title} | ${fieldByKey(i.field).label} | ${i.level} | ${i.duration} | ${i.mode} | ${formatINR(i.price)} — ${i.summary}`,
    ).join("\n");

    const instructions = `You are Researchly's friendly helper for Indian school and college students.
Researchly offers mentored research projects and courses. Help students find the right ones, explain what they include, and answer study and career questions.
Only recommend programmes from this catalogue, using their exact titles and prices in rupees:
${catalogue}

Rules:
- Reply in clear, simple English, in under 150 words.
- Use short "•" bullet points when listing options. Plain text only, no markdown headings, bold or tables.
- To buy, students tap "Select" on a card, then go to Buy. Payment and accounts are handled by the app, not by you.
- Never ask for phone numbers, addresses or other personal details.
- If you don't know something, say so honestly.`;

    try {
      const res = await generateResponse({
        model: "openai/gpt-6-astra",
        instructions,
        input: data.messages.map((m) => ({ role: m.role, content: m.content })),
        reasoning: { effort: "low" },
      });
      const answer = res.output
        .flatMap((o) => (o.type === "message" ? o.content : []))
        .map((c) => (c.type === "output_text" ? c.text : ""))
        .join("")
        .trim();
      return answer ? { ok: true, answer } : { ok: false, message: FRIENDLY };
    } catch (error) {
      console.error("[assistant] AI call failed", error instanceof GatewayError ? error.toJSON() : error);
      if (error instanceof GatewayError && error.code === "rate_limited") return { ok: false, message: BUSY };
      return { ok: false, message: FRIENDLY };
    }
  });
