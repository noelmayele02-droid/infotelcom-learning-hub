type FaqItem = { q: string; a: string };

export function FaqSection({ items, title = "Questions fréquentes" }: { items: FaqItem[]; title?: string }) {
  if (!items.length) return null;
  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="text-2xl font-bold text-foreground md:text-3xl">{title}</h2>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {items.map((it) => (
          <details
            key={it.q}
            className="group rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)] open:shadow-[var(--shadow-elegant)]"
          >
            <summary className="cursor-pointer list-none font-semibold text-foreground marker:hidden">
              <span className="flex items-center justify-between gap-3">
                {it.q}
                <span className="text-primary transition-transform group-open:rotate-45">+</span>
              </span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground">{it.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function FaqJsonLd({ items }: { items: FaqItem[] }) {
  if (!items.length) return null;
  const json = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}