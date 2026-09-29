import { Outlet } from "react-router-dom";
import { Bot, Frown, ShieldCheck, Sparkles } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { DecisionBadge } from "@/components/shared/decision-badge";

export function AuthLayout() {
  return (
    <div className="grid min-h-svh lg:grid-cols-[1fr_1.05fr]">
      <div className="relative flex flex-col px-6 py-8 sm:px-12">
        <Logo />
        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-[400px] animate-fade-up">
            <Outlet />
          </div>
        </div>
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Resolve · AI-assisted refund support</p>
      </div>

      <aside className="relative hidden overflow-hidden bg-sidebar lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,oklch(0.5_0.2_280/0.55),transparent_60%),radial-gradient(ellipse_at_bottom_left,oklch(0.55_0.16_200/0.35),transparent_55%)]" />
        <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(white_1px,transparent_1px),linear-gradient(90deg,white_1px,transparent_1px)] [background-size:44px_44px]" />

        <div className="relative flex h-full flex-col justify-center px-14 py-16 xl:px-20">
          <p className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/80">
            <Sparkles className="size-3.5" /> Policy-grounded AI decisions
          </p>
          <h2 className="max-w-md text-4xl font-semibold leading-[1.1] tracking-tight text-white text-balance">
            Refunds resolved in seconds — with a human when it matters.
          </h2>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-sidebar-muted">
            Every request is checked against your order history and refund policy. Clear-cut cases are resolved instantly; anything
            unusual goes to a specialist.
          </p>

          <div className="mt-10 max-w-md space-y-3">
            <div className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-white/95 px-4 py-2.5 text-sm text-zinc-800 shadow-lg">
              My headphones arrived with a cracked headband <Frown className="inline size-4 -mt-0.5 text-zinc-500" />
            </div>
            <div className="w-[92%] rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.07] p-4 text-sm text-white/90 shadow-xl backdrop-blur-md">
              <div className="mb-2 flex items-center justify-between">
                <span className="flex items-center gap-2 text-xs font-medium text-white/60">
                  <Bot className="size-3.5" /> Resolve assistant
                </span>
                <DecisionBadge status="approved" />
              </div>
              Sorry about that, Ada — your refund of <span className="font-semibold text-white">$129.00</span> has been approved and
              will reach your card in 5–7 business days.
            </div>
            <div className="flex items-center gap-2 pl-1 pt-2 text-xs text-white/50">
              <ShieldCheck className="size-3.5" /> 9 policy checks passed · reference RF-7K2QXM
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
