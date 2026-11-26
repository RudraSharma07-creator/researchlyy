import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, FlaskConical, Search, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ItemCard } from "@/components/researchly/ItemCard";
import { ItemDetailSheet } from "@/components/researchly/ItemDetailSheet";
import { AssistantButton } from "@/components/researchly/AssistantDialog";
import { CATALOG, FIELDS, fieldByKey, type CatalogItem, type FieldKey, type ItemKind } from "@/lib/catalog";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Researchly — Research opportunities & courses for Indian students" },
      {
        name: "description",
        content:
          "Browse mentored research projects and courses in astronomy, biology, economics, robotics, psychology, history and more.",
      },
      { property: "og:title", content: "Researchly — Research opportunities & courses" },
      {
        property: "og:description",
        content: "Mentored research and courses across 12 fields for Indian students. Pick, add to cart and enrol.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const [query, setQuery] = useState("");
  const [field, setField] = useState<FieldKey | "all">("all");
  const [open, setOpen] = useState<CatalogItem | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CATALOG.filter((i) => {
      if (field !== "all" && i.field !== field) return false;
      if (!q) return true;
      return [i.title, i.summary, fieldByKey(i.field).label].some((t) => t.toLowerCase().includes(q));
    });
  }, [query, field]);

  const research = filtered.filter((i) => i.kind === "research");
  const courses = filtered.filter((i) => i.kind === "course");

  return (
    <main>
      <section className="bg-hero relative overflow-hidden text-ink-foreground">
        <div className="bg-stars pointer-events-none absolute inset-0 opacity-80" />
        <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-12 sm:px-6 sm:pt-16">
          <p className="inline-flex items-center gap-2 rounded-full border border-ink-foreground/20 px-3 py-1 text-xs font-medium tracking-wide">
            <Sparkles className="size-3.5 text-research" /> {CATALOG.length} programmes · {FIELDS.length} fields
          </p>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.05] sm:text-6xl">
            Real research. Real courses.{" "}
            <span className="italic text-research">Built by an Indian, built for Indian students.</span>
          </h1>
          <p className="mt-4 max-w-xl text-base text-ink-foreground/75 sm:text-lg">
            Hover over any card for a quick look, tap the photo for full details, and select as many as you like.
          </p>

          <div className="relative mt-8 max-w-xl">
            <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search e.g. black holes, AI, constitution…"
              className="h-12 rounded-full border-transparent bg-card pl-11 text-base text-foreground shadow-lift"
              aria-label="Search programmes"
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filter by field">
            <FieldChip active={field === "all"} onClick={() => setField("all")}>
              All fields
            </FieldChip>
            {FIELDS.map((f) => (
              <FieldChip key={f.key} active={field === f.key} onClick={() => setField(f.key)}>
                {f.label}
              </FieldChip>
            ))}
          </div>
        </div>
      </section>

      <div className="bg-notebook">
        <Section kind="research" items={research} onOpen={setOpen} />
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 sm:px-6" aria-hidden>
          <span className="h-px flex-1 bg-border" />
          <span className="font-display text-sm italic text-muted-foreground">or learn the foundations</span>
          <span className="h-px flex-1 bg-border" />
        </div>
        <Section kind="course" items={courses} onOpen={setOpen} />
      </div>

      <ItemDetailSheet item={open} onClose={() => setOpen(null)} />
      <AssistantButton />
    </main>
  );
}

function FieldChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
        active
          ? "border-research bg-research text-research-foreground"
          : "border-ink-foreground/20 text-ink-foreground/85 hover:bg-ink-foreground/10",
      )}
    >
      {children}
    </button>
  );
}

function Section({ kind, items, onOpen }: { kind: ItemKind; items: CatalogItem[]; onOpen: (i: CatalogItem) => void }) {
  const research = kind === "research";
  const Icon = research ? FlaskConical : BookOpen;
  return (
    <section id={research ? "research" : "courses"} className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "grid size-12 place-items-center rounded-2xl",
              research ? "bg-research text-research-foreground" : "bg-course text-course-foreground",
            )}
          >
            <Icon className="size-6" />
          </span>
          <div>
            <h2 className="text-3xl font-semibold sm:text-4xl">{research ? "Research opportunities" : "Courses"}</h2>
            <p className="text-sm text-muted-foreground">
              {research
                ? "Work 1:1 or in small groups with PhD mentors on real questions."
                : "Live and self-paced classes to build strong fundamentals."}
            </p>
          </div>
        </div>
        <span className="rounded-full border border-border bg-card px-3 py-1 text-sm font-medium">
          {items.length} {research ? "projects" : "courses"}
        </span>
      </div>

      {items.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border bg-card/60 p-10 text-center text-muted-foreground">
          No {research ? "research projects" : "courses"} match your search. Try another field.
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} onOpen={onOpen} />
          ))}
        </div>
      )}
    </section>
  );
}
