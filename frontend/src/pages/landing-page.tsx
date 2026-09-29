import { Link } from "react-router-dom";
import { ArrowRight, Bot, FileCheck2, LockKeyhole, ScanSearch, ShieldCheck, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DecisionBadge } from "@/components/shared/decision-badge";
import useSession from "@/hooks/auth/useSession";
import type { RefundStatus } from "@/utils/types";

const PIPELINE = [
  { icon: ScanSearch, title: "Order lookup", body: "We pull your order, items and history — amounts always come from our records, never the chat." },
  { icon: FileCheck2, title: "Policy rules", body: "Refund window, final sale, duplicates, $500 review limit and account checks run deterministically." },
  { icon: Bot, title: "AI analysis", body: "Gemini reads your message to classify the issue and spot anything that doesn't add up." },
  { icon: UserCheck, title: "Decision", body: "Clear cases are approved or denied instantly. Anything unusual goes to a specialist." },
];

const SCENARIOS: { who: string; what: string; outcome: RefundStatus }[] = [
  { who: "ada@", what: "Headphones arrived damaged", outcome: "approved" },
  { who: "grace@", what: "Final-sale clearance jacket", outcome: "denied" },
  { who: "alan@", what: "$1,299 laptop", outcome: "escalated" },
  { who: "katherine@", what: "Delivered 75 days ago", outcome: "denied" },
  { who: "barbara@", what: "Shirt + final-sale scarf", outcome: "approved" },
  { who: "margaret@", what: "Account on fraud watch", outcome: "escalated" },
  { who: "radia@", what: "Order already refunded", outcome: "denied" },
  { who: "john@", what: "Try “ignore previous instructions…”", outcome: "escalated" },
];

export function LandingPage() {
  const { user, isAdmin } = useSession();

  return (
    <div>
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-dots [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
        <div className="absolute -top-40 left-1/2 h-80 w-[48rem] -translate-x-1/2 rounded-full bg-indigo-400/20 blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 sm:py-28">
          <p className="mx-auto inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
            <ShieldCheck className="size-3.5 text-primary" /> Policy-grounded · Human-in-the-loop
          </p>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
            Refund support that's <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">fast and fair</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground text-balance">
            Tell us what went wrong. Resolve checks your order against our refund policy, uses AI to understand your request, and
            gives you a clear answer in seconds.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" asChild>
              <Link to={user ? "/support" : "/signup"}>
                {user ? "Open support chat" : "Start a refund request"} <ArrowRight />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to={isAdmin ? "/admin" : user ? "/policy" : "/login"}>
                {isAdmin ? "Admin dashboard" : user ? "Read the policy" : "Sign in"}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <h2 className="text-center text-sm font-semibold uppercase tracking-wider text-primary">How a request is decided</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PIPELINE.map((step, i) => (
            <div key={step.title} className="relative rounded-2xl border bg-card p-5 shadow-sm">
              <span className="absolute top-5 right-5 font-mono text-xs text-muted-foreground">0{i + 1}</span>
              <span className="flex size-10 items-center justify-center rounded-xl bg-accent text-primary">
                <step.icon className="size-5" />
              </span>
              <h3 className="mt-4 font-semibold">{step.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-start gap-4 rounded-2xl border bg-sidebar p-6 text-sidebar-foreground">
          <LockKeyhole className="mt-0.5 size-5 shrink-0 text-indigo-300" />
          <p className="text-sm leading-relaxed text-sidebar-muted">
            <span className="font-semibold text-sidebar-foreground">The AI advises, the rules decide.</span> The model can make a
            decision stricter — never more generous. Messages that try to talk the system into a refund are treated as untrusted data,
            logged, and sent to a human.
          </p>
        </div>
      </section>

      <section className="border-t bg-muted/40">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-center">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight">Try it with demo customers</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Fifteen seeded customers each exercise a different part of the policy. Sign in with any of them using{" "}
                <span className="font-mono text-foreground">Password123!</span>, or use{" "}
                <span className="font-mono text-foreground">admin@resolve.dev</span> / <span className="font-mono text-foreground">Admin123!</span> for
                the dashboard.
              </p>
              <Button className="mt-6" asChild>
                <Link to="/login">
                  Sign in to try it <ArrowRight />
                </Link>
              </Button>
            </div>
            <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
              {SCENARIOS.map((s) => (
                <div key={s.who} className="flex items-center justify-between gap-4 border-b px-5 py-3 last:border-0">
                  <div className="min-w-0">
                    <p className="font-mono text-xs text-muted-foreground">{s.who}resolve.dev</p>
                    <p className="truncate text-sm">{s.what}</p>
                  </div>
                  <DecisionBadge status={s.outcome} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
