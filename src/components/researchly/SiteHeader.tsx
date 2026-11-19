import { Link } from "@tanstack/react-router";
import { LogIn, LogOut, ShoppingCart, Telescope } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Explore" },
  { to: "/selected", label: "My selection" },
  { to: "/checkout", label: "Buy" },
] as const;

export function SiteHeader() {
  const { count, setPopupOpen } = useCart();
  const { user, ready, displayName, openAuth, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-xl bg-ink text-research">
            <Telescope className="size-5" />
          </span>
          <span className="font-display text-xl font-semibold tracking-tight">Researchly</span>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-border bg-card p-1 md:flex">
          {NAV.map((n, i) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: true }}
              className="rounded-full px-4 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "bg-ink !text-ink-foreground" }}
            >
              <span className="mr-1.5 text-xs opacity-60">{i + 1}</span>
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {!ready ? (
            <span className="h-9 w-20" aria-hidden />
          ) : user ? (
            <>
              <span
                title={user.email ?? ""}
                className="hidden max-w-40 truncate text-sm font-medium text-muted-foreground lg:inline"
              >
                Hi, {displayName.split(" ")[0]}
              </span>
              <Button
                variant="outline"
                size="pill"
                onClick={async () => {
                  await signOut();
                  toast.success("You've signed out.");
                }}
              >
                <LogOut /> Sign out
              </Button>
            </>
          ) : (
            <Button variant="ink" size="pill" onClick={() => openAuth("login")}>
              <LogIn /> Log in
            </Button>
          )}
        <button
          type="button"
          onClick={() => setPopupOpen(true)}
          aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}
          className="relative grid size-11 place-items-center rounded-full border border-border bg-card shadow-card transition-transform hover:-translate-y-0.5"
        >
          <ShoppingCart className="size-5" />
          {count > 0 && (
            <span
              key={count}
              className={cn(
                "animate-pop absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-research px-1 text-[11px] font-bold text-research-foreground",
              )}
            >
              {count}
            </span>
          )}
        </button>
        </div>
      </div>
      <nav className="flex justify-center gap-1 border-t border-border/60 px-2 py-1.5 md:hidden">
        {NAV.map((n) => (
          <Link
            key={n.to}
            to={n.to}
            activeOptions={{ exact: true }}
            className="rounded-full px-3 py-1 text-xs font-medium text-muted-foreground"
            activeProps={{ className: "bg-ink !text-ink-foreground" }}
          >
            {n.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
