import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowUp, Bot, Loader2, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { askAssistant } from "@/lib/assistant.functions";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "assistant"; content: string; failed?: boolean };

const FRIENDLY =
  "Sorry, I can't answer right now. Please try again in a moment — you can still browse every programme on this page.";
const SUGGESTIONS = [
  "Which research project suits a biology student?",
  "Beginner courses under ₹6,000",
  "I like space and coding — what should I pick?",
];

/** The "AI" button on Home and its chat pop-up with a "How can I help you?" search bar. */
export function AssistantButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Ask Researchly AI"
        className="fixed bottom-6 right-6 z-30 flex items-center gap-2 rounded-full bg-ink px-5 py-3.5 font-display text-lg font-semibold text-ink-foreground shadow-lift transition-transform hover:-translate-y-0.5 active:scale-95"
      >
        <Sparkles className="size-5 text-research" /> AI
      </button>
      <AssistantDialog open={open} onOpenChange={setOpen} />
    </>
  );
}

function AssistantDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const ask = useServerFn(askAssistant);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  const send = async (question: string) => {
    const q = question.trim().slice(0, 1500);
    if (!q || busy) return;
    const next: Msg[] = [...messages, { role: "user", content: q }];
    setMessages(next);
    setText("");
    setBusy(true);
    try {
      // Send only real turns (not failure notices), and keep the conversation short.
      const history = next.filter((m) => !m.failed).slice(-11).map(({ role, content }) => ({ role, content }));
      const reply = await ask({ data: { messages: history } });
      setMessages((m) => [
        ...m,
        reply.ok ? { role: "assistant", content: reply.answer } : { role: "assistant", content: reply.message, failed: true },
      ]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: FRIENDLY, failed: true }]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85vh] max-w-lg flex-col gap-0 overflow-hidden p-0">
        <DialogHeader className="border-b border-border bg-paper-deep px-6 py-5 text-left">
          <DialogTitle className="flex items-center gap-2 font-display text-2xl">
            <Sparkles className="size-5 text-research" /> Researchly AI
          </DialogTitle>
          <DialogDescription>Ask about courses, research projects or your study plans.</DialogDescription>
        </DialogHeader>

        <div ref={listRef} className="min-h-48 flex-1 space-y-3 overflow-y-auto px-6 py-5" aria-live="polite">
          {messages.length === 0 && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Try asking:</p>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="block w-full rounded-xl border border-border bg-card px-4 py-2.5 text-left text-sm hover:bg-muted"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={cn("flex gap-2", m.role === "user" ? "justify-end" : "justify-start")}>
              {m.role === "assistant" && (
                <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-ink text-research">
                  <Bot className="size-4" />
                </span>
              )}
              <p
                className={cn(
                  "max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                  m.role === "user" && "bg-ink text-ink-foreground",
                  m.role === "assistant" && !m.failed && "bg-muted text-foreground",
                  m.failed && "border border-research/40 bg-research/10 text-foreground",
                )}
              >
                {m.content}
              </p>
            </div>
          ))}
          {busy && (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> Thinking…
            </p>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void send(text);
          }}
          className="flex items-center gap-2 border-t border-border bg-card px-4 py-3"
        >
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="How can I help you?"
            aria-label="How can I help you?"
            maxLength={1500}
            autoFocus
            className="h-11 flex-1 rounded-full border border-input bg-background px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <button
            type="submit"
            disabled={busy || !text.trim()}
            aria-label="Send"
            className="grid size-11 shrink-0 place-items-center rounded-full bg-ink text-ink-foreground disabled:opacity-40"
          >
            <ArrowUp className="size-5" />
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
