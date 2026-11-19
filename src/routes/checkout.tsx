import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { ArrowLeft, LogIn, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CashPayButton } from "@/components/researchly/CashPayButton";
import { KindBadge } from "@/components/researchly/KindBadge";
import { OrdersPanel } from "@/components/researchly/OrdersPanel";
import { PaymentDialog } from "@/components/researchly/PaymentDialog";
import { useAuth } from "@/lib/auth";
import { placeOrder } from "@/lib/orders.functions";
import { useCart } from "@/lib/cart";
import { formatINR, itemImage } from "@/lib/catalog";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Buy — Researchly" },
      {
        name: "description",
        content: "Pay for your selected research projects and courses on Researchly.",
      },
      { property: "og:title", content: "Buy — Researchly" },
      {
        property: "og:description",
        content: "Complete your enrolment in research projects and courses.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CheckoutPage,
});

// Only name and email are ever collected.
const buyerSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80, "Name is too long"),
  email: z.string().trim().email("Please enter a valid email").max(255),
});

function CheckoutPage() {
  const { ids, items, total, clear } = useCart();
  const { user, displayName, openAuth } = useAuth();
  const queryClient = useQueryClient();
  const placeOrderFn = useServerFn(placeOrder);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ name?: string | undefined; email?: string | undefined }>(
    {},
  );
  const [payOpen, setPayOpen] = useState(false);
  const [paid, setPaid] = useState<{ amount: string; name: string; email: string } | null>(null);

  const amountLabel = formatINR(total);

  // Signed in: the account's email is used, and the name is filled in from the account.
  useEffect(() => {
    if (!user) return;
    setEmail(user.email ?? "");
    setName((n) => n || (displayName !== user.email ? displayName : ""));
  }, [user, displayName]);

  const handlePay = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!user) {
      toast("Please log in or create an account to place your order.");
      openAuth("login");
      return;
    }
    const result = buyerSchema.safeParse({ name, email });
    if (!result.success) {
      const f = result.error.flatten().fieldErrors;
      setErrors({ name: f.name?.[0], email: f.email?.[0] });
      return;
    }
    setErrors({});
    setPayOpen(true);
  };

  const paymentDialog = (
    <PaymentDialog
      open={payOpen}
      onOpenChange={setPayOpen}
      amountLabel={paid?.amount ?? amountLabel}
      name={name}
      email={email}
      onPaid={async () => {
        const order = await placeOrderFn({ data: { ids } });
        setPaid({ amount: formatINR(order.total), name, email });
        clear();
        await queryClient.invalidateQueries({ queryKey: ["orders"] });
      }}
    />
  );

  if (items.length === 0 || paid) {
    return (
      <main className="bg-notebook flex min-h-[calc(100vh-4rem)] flex-col items-center gap-8 px-4 py-12">
        <div className="w-full max-w-md rounded-3xl border border-border bg-card p-10 text-center shadow-lift">
          <p className="font-display text-3xl">{paid ? "Thank you!" : "Your cart is empty"}</p>
          <p className="mt-2 text-muted-foreground">
            {paid
              ? `We've sent your enrolment details to ${paid.email}.`
              : "Select a research project or course to continue."}
          </p>
          <Button asChild variant="ink" size="xl" className="mt-6">
            <Link to="/">{paid ? "Explore more" : "Explore programmes"}</Link>
          </Button>
        </div>
        {user ? (
          <div className="w-full max-w-3xl">
            <OrdersPanel />
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            <button type="button" onClick={() => openAuth("login")} className="font-semibold text-foreground underline underline-offset-4">
              Log in
            </button>{" "}
            to see your past orders.
          </p>
        )}
        {paymentDialog}
      </main>
    );
  }

  return (
    <main className="bg-notebook min-h-[calc(100vh-4rem)]">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <Link
          to="/selected"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Back to selection
        </Link>
        <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">Buy</h1>
        <p className="mt-2 text-muted-foreground">
          Check your items, tell us your name and email, then tap the note to pay.
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
          <section
            aria-label="Items to buy"
            className="self-start overflow-hidden rounded-3xl border border-border bg-card shadow-card"
          >
            <ul className="divide-y divide-border">
              {items.map((item) => (
                <li key={item.id} className="flex items-center gap-4 p-4">
                  <img
                    src={itemImage(item)}
                    alt=""
                    width={64}
                    height={64}
                    loading="lazy"
                    className="size-16 shrink-0 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <KindBadge kind={item.kind} />
                    <p className="mt-1 truncate font-semibold">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.duration}</p>
                  </div>
                  <span className="font-semibold tabular-nums">{formatINR(item.price)}</span>
                </li>
              ))}
            </ul>
            <div className="flex items-baseline justify-between border-t border-border bg-paper-deep px-4 py-4">
              <span className="text-sm font-medium text-muted-foreground">
                Total ({items.length} {items.length === 1 ? "item" : "items"})
              </span>
              <span className="font-display text-3xl font-semibold tabular-nums">
                {formatINR(total)}
              </span>
            </div>
          </section>

          <form
            onSubmit={handlePay}
            noValidate
            className="flex flex-col rounded-3xl border border-border bg-card p-6 shadow-lift lg:sticky lg:top-24 lg:self-start"
          >
            <h2 className="text-2xl font-semibold">Your details</h2>
            {!user && (
              <div className="mt-3 flex items-start gap-3 rounded-xl border border-research/40 bg-research/10 p-3 text-sm">
                <LogIn className="mt-0.5 size-4 shrink-0" />
                <p>
                  You'll need an account to place your order.{" "}
                  <button type="button" onClick={() => openAuth("login")} className="font-semibold underline underline-offset-4">
                    Log in
                  </button>{" "}
                  or{" "}
                  <button type="button" onClick={() => openAuth("signup")} className="font-semibold underline underline-offset-4">
                    sign up
                  </button>
                  .
                </p>
              </div>
            )}
            <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Lock className="size-3.5" /> We only need your name and email.
            </p>
            <div className="mt-5 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ananya Sharma"
                  autoComplete="name"
                  aria-invalid={Boolean(errors.name)}
                  className="h-11"
                />
                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ananya@example.com"
                  autoComplete="email"
                  readOnly={Boolean(user)}
                  aria-invalid={Boolean(errors.email)}
                  className="h-11 read-only:bg-muted read-only:text-muted-foreground"
                />
                {user && <p className="text-xs text-muted-foreground">Your account email.</p>}
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>
            </div>
            <div className="mt-8 flex justify-center">
              <CashPayButton onClick={() => undefined} amountLabel={formatINR(total)} />
            </div>
          </form>
        </div>

        {user && (
          <div className="mt-10">
            <OrdersPanel />
          </div>
        )}
      </div>

      {paymentDialog}
    </main>
  );
}
