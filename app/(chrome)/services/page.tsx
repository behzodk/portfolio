import Link from "next/link"
import { Sparkles, Link as LinkIcon, ShieldCheck, ChartLine } from "lucide-react"
import { AnimatedSection } from "@/components/ui/animated-section"

const services = [
  {
    title: "B Link Studio",
    headline: "Opinionated URL shortener for purposeful sharing",
    description:
      "Craft branded short links, control visibility, and set expirations with a few clicks. Built on Supabase for transparency and speed.",
    bullets: [
      "Custom slugs, private links, and passcode protection",
      "Auto-expiring links for drops, launches, and memo sharing",
      "Live connection to Supabase so every link is stored instantly",
    ],
    icon: LinkIcon,
    cta: { label: "Shorten a URL", href: "/shorten-url" },
  },
]

const roadmap = [
  {
    title: "Analytics overlays",
    description: "Surface click counts, top referrers, and geography summaries directly inside the link card.",
  },
  {
    title: "Workspace sharing",
    description: "Invite collaborators to manage links with tags, notes, and shared folders.",
  },
  {
    title: "Webhook automations",
    description: "Trigger downstream workflows whenever a link hits a threshold or expires.",
  },
]

export default function ServicesPage() {
  return (
    <div className="w-full">
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-5xl mx-auto text-center space-y-5">
          <p className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary">
            <Sparkles className="h-4 w-4" />
            BServices
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">BServices: tools crafted for intentional sharing</h1>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-12">
          {services.map((service) => (
            <AnimatedSection key={service.title} className="rounded-3xl border border-border/60 bg-card/80 p-8 shadow-sm">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3 text-sm uppercase tracking-[0.4em] text-primary">
                    <service.icon className="h-5 w-5" />
                    {service.title}
                  </div>
                  <h2 className="text-3xl font-bold">{service.headline}</h2>
                  <p className="text-muted-foreground text-base">{service.description}</p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {service.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-2">
                        <ShieldCheck className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col gap-3 lg:w-64">
                  <Link
                    href={service.cta.href}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 text-primary-foreground font-semibold shadow-md shadow-primary/30 hover:shadow-primary/50 transition"
                  >
                    {service.cta.label}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    Built with Supabase Auth + Postgres. Sign in via Google to start, nothing else required.
                  </p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/20">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="space-y-3 text-center">
            <p className="text-sm uppercase tracking-[0.4em] text-primary">Roadmap</p>
            <h2 className="text-3xl font-bold">What’s coming next</h2>
            <p className="text-muted-foreground">
              The shortener is just step one. Here’s what’s actively being built around it.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {roadmap.map((item) => (
              <div key={item.title} className="rounded-2xl border border-border/60 bg-card/80 p-5 space-y-2">
                <ChartLine className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
