import { useEffect, useState } from "react";
import { Loader2, MailCheck } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

const emailSchema = z.string().trim().email("Please enter a valid email").max(255);
const passwordSchema = z.string().min(8, "Use at least 8 characters").max(72, "Password is too long");
const nameSchema = z.string().trim().min(2, "Please enter your name").max(80, "Name is too long");

function friendlyError(message: string) {
  if (/invalid login credentials/i.test(message)) return "Wrong email or password.";
  if (/email not confirmed/i.test(message)) return "Please confirm your email first — check your inbox for our link.";
  if (/already registered/i.test(message)) return "This email already has an account. Try logging in.";
  return message;
}

/** Log in / sign up pop-up. Only name, email and a password are asked for. */
export function AuthDialog() {
  const { dialogOpen, setDialogOpen, mode, setMode } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; form?: string }>({});
  const [busy, setBusy] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);

  useEffect(() => {
    if (dialogOpen) {
      setErrors({});
      setSentTo(null);
      setPassword("");
    }
  }, [dialogOpen, mode]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    const em = emailSchema.safeParse(email);
    if (!em.success) next.email = em.error.issues[0]?.message;
    const pw = passwordSchema.safeParse(password);
    if (!pw.success) next.password = pw.error.issues[0]?.message;
    let cleanName = "";
    if (mode === "signup") {
      const nm = nameSchema.safeParse(name);
      if (!nm.success) next.name = nm.error.issues[0]?.message;
      else cleanName = nm.data;
    }
    setErrors(next);
    if (Object.keys(next).length || !em.success) return;

    setBusy(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: em.data,
          password,
          options: { emailRedirectTo: window.location.origin, data: { full_name: cleanName } },
        });
        if (error) return setErrors({ form: friendlyError(error.message) });
        if (data.session) {
          toast.success(`Welcome to Researchly, ${cleanName.split(" ")[0]}!`);
        } else {
          setSentTo(em.data);
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: em.data, password });
        if (error) return setErrors({ form: friendlyError(error.message) });
        toast.success("You're logged in.");
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={(o) => !busy && setDialogOpen(o)}>
      <DialogContent className="max-w-md">
        {sentTo ? (
          <div className="py-2 text-center">
            <span className="mx-auto grid size-14 place-items-center rounded-full bg-course text-course-foreground">
              <MailCheck className="size-7" />
            </span>
            <DialogTitle className="mt-4 font-display text-2xl">Check your email</DialogTitle>
            <DialogDescription className="mt-2">
              We sent a confirmation link to <span className="font-semibold text-foreground">{sentTo}</span>. Click it,
              then come back and log in.
            </DialogDescription>
            <Button variant="ink" size="xl" className="mt-6 w-full" onClick={() => setMode("login")}>
              Go to log in
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader className="text-left">
              <DialogTitle className="font-display text-2xl">
                {mode === "login" ? "Log in to Researchly" : "Create your account"}
              </DialogTitle>
              <DialogDescription>
                {mode === "login"
                  ? "Log in to place your order and see your past orders."
                  : "We only ask for your name and email, plus a password."}
              </DialogDescription>
            </DialogHeader>

            <div role="tablist" aria-label="Account" className="grid grid-cols-2 gap-1 rounded-full bg-muted p-1">
              {(["login", "signup"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  role="tab"
                  aria-selected={mode === m}
                  onClick={() => setMode(m)}
                  className={
                    mode === m
                      ? "rounded-full bg-card py-1.5 text-sm font-semibold shadow-card"
                      : "rounded-full py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
                  }
                >
                  {m === "login" ? "Log in" : "Sign up"}
                </button>
              ))}
            </div>

            <form onSubmit={submit} noValidate className="space-y-4">
              {mode === "signup" && (
                <div className="space-y-1.5">
                  <Label htmlFor="auth-name">Full name</Label>
                  <Input
                    id="auth-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ananya Sharma"
                    autoComplete="name"
                    aria-invalid={Boolean(errors.name)}
                    className="h-11"
                  />
                  {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                </div>
              )}
              <div className="space-y-1.5">
                <Label htmlFor="auth-email">Email</Label>
                <Input
                  id="auth-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ananya@example.com"
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                  className="h-11"
                />
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="auth-password">Password</Label>
                <Input
                  id="auth-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  aria-invalid={Boolean(errors.password)}
                  className="h-11"
                />
                {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
              </div>
              {errors.form && (
                <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {errors.form}
                </p>
              )}
              <Button type="submit" variant="ink" size="xl" className="w-full" disabled={busy}>
                {busy && <Loader2 className="animate-spin" />}
                {mode === "login" ? "Log in" : "Create account"}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
