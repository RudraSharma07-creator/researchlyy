import { useEffect, useState } from "react";
import { Building2, CreditCard, Loader2, Smartphone, Wallet, PartyPopper } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const METHODS = [
  { id: "upi", label: "UPI", hint: "GPay, PhonePe, Paytm, BHIM", icon: Smartphone },
  { id: "card", label: "Debit / Credit card", hint: "Visa, Mastercard, RuPay", icon: CreditCard },
  { id: "netbanking", label: "Net banking", hint: "All major Indian banks", icon: Building2 },
  { id: "wallet", label: "Wallets", hint: "Paytm, Amazon Pay, Mobikwik", icon: Wallet },
] as const;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amountLabel: string;
  name: string;
  email: string;
  onPaid: () => void;
};

export function PaymentDialog({ open, onOpenChange, amountLabel, name, email, onPaid }: Props) {
  const [method, setMethod] = useState<(typeof METHODS)[number]["id"]>("upi");
  const [stage, setStage] = useState<"choose" | "processing" | "done">("choose");

  useEffect(() => {
    if (open) setStage("choose");
  }, [open]);

  const pay = () => {
    setStage("processing");
    window.setTimeout(() => {
      setStage("done");
      onPaid();
    }, 1600);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => stage !== "processing" && onOpenChange(o)}>
      <DialogContent className="max-w-md">
        {stage === "done" ? (
          <div className="py-4 text-center">
            <span className="mx-auto grid size-16 place-items-center rounded-full bg-cash text-cash-foreground">
              <PartyPopper className="size-8" />
            </span>
            <DialogTitle className="mt-4 font-display text-2xl">You're enrolled, {name.split(" ")[0]}!</DialogTitle>
            <DialogDescription className="mt-2">
              Payment of {amountLabel} received. Your welcome kit and schedule are on their way to{" "}
              <span className="font-semibold text-foreground">{email}</span>.
            </DialogDescription>
            <Button variant="ink" size="xl" className="mt-6 w-full" onClick={() => onOpenChange(false)}>
              Done
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader className="text-left">
              <DialogTitle className="font-display text-2xl">Choose how to pay</DialogTitle>
              <DialogDescription>Amount due: {amountLabel}</DialogDescription>
            </DialogHeader>
            <div role="radiogroup" aria-label="Payment method" className="grid gap-2">
              {METHODS.map((m) => {
                const active = method === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setMethod(m.id)}
                    disabled={stage === "processing"}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-colors",
                      active ? "border-cash-deep bg-cash/15" : "border-border hover:bg-muted",
                    )}
                  >
                    <span className={cn("grid size-10 place-items-center rounded-lg", active ? "bg-cash text-cash-foreground" : "bg-muted")}>
                      <m.icon className="size-5" />
                    </span>
                    <span className="flex-1">
                      <span className="block text-sm font-semibold">{m.label}</span>
                      <span className="block text-xs text-muted-foreground">{m.hint}</span>
                    </span>
                    <span className={cn("size-4 rounded-full border-2", active ? "border-cash-deep bg-cash-deep" : "border-input")} />
                  </button>
                );
              })}
            </div>
            <Button variant="ink" size="xl" className="w-full" onClick={pay} disabled={stage === "processing"}>
              {stage === "processing" ? (
                <>
                  <Loader2 className="animate-spin" /> Processing…
                </>
              ) : (
                <>Pay {amountLabel}</>
              )}
            </Button>
            <p className="text-center text-xs text-muted-foreground">Demo checkout — no real money is charged.</p>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
