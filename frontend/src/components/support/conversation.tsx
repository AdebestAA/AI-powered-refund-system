import { useEffect, useState } from "react";
import { Bot, Check, Hand, Loader2 } from "lucide-react";
import { DecisionBadge } from "@/components/shared/decision-badge";
import { DECISION_META } from "@/lib/decision-meta";
import { ago, money } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { RefundRequest } from "@/utils/types";

export function AssistantAvatar() {
  return (
    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-sm">
      <Bot className="size-4" />
    </span>
  );
}

export function WelcomeMessage({ name }: { name: string }) {
  return (
    <div className="flex gap-3">
      <AssistantAvatar />
      <div className="max-w-[85%] rounded-2xl rounded-tl-md bg-muted px-4 py-3 text-sm leading-relaxed">
        Hi {name.split(" ")[0]} <Hand className="inline size-4 -mt-0.5 text-amber-500" /> I'm the Resolve refund assistant. Pick an order and tell me what went wrong — I'll check it
        against our refund policy and get back to you right away.
      </div>
    </div>
  );
}

export function CustomerBubble({ message, orderNumber, time }: { message: string; orderNumber: string; time?: string }) {
  return (
    <div className="flex flex-col items-end gap-1.5 animate-fade-up">
      <div className="max-w-[85%] whitespace-pre-wrap break-words rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-sm leading-relaxed text-primary-foreground shadow-sm">
        {message}
      </div>
      <p className="text-[11px] text-muted-foreground">
        <span className="font-mono">{orderNumber}</span>
        {time && ` · ${ago(time)}`}
      </p>
    </div>
  );
}

export function DecisionCard({ refund }: { refund: RefundRequest }) {
  return (
    <div className="flex gap-3 animate-fade-up">
      <AssistantAvatar />
      <div className="w-full max-w-[85%] overflow-hidden rounded-2xl rounded-tl-md border bg-card shadow-sm">
        <div className={cn("h-1", DECISION_META[refund.status].dot)} />
        <div className="p-4">
          <div className="flex items-center justify-between gap-2">
            <DecisionBadge status={refund.status} />
            {refund.status === "approved" && (
              <span className="text-sm font-semibold tabular-nums text-success-ink">{money(refund.refundAmount)}</span>
            )}
          </div>
          <p className="mt-3 text-sm leading-relaxed">{refund.reply}</p>
          {refund.reviewedAt && (
            <p className="mt-3 rounded-lg bg-accent px-3 py-2 text-xs text-accent-foreground">
              Reviewed by our support team
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

const THINKING_STEPS = ["Looking up your order", "Reading your message", "Checking the refund policy"];

export function ThinkingBubble() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setStep((s) => Math.min(s + 1, THINKING_STEPS.length - 1)), 1400);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex gap-3 animate-fade-up">
      <AssistantAvatar />
      <div className="rounded-2xl rounded-tl-md bg-muted px-4 py-3">
        <ul className="space-y-1.5">
          {THINKING_STEPS.map((label, i) => (
            <li
              key={label}
              className={cn(
                "flex items-center gap-2 text-xs transition-opacity",
                i > step ? "opacity-30" : "opacity-100",
                i === step ? "font-medium text-foreground" : "text-muted-foreground",
              )}
            >
              {i < step ? (
                <Check className="size-3.5 text-success" />
              ) : i === step ? (
                <Loader2 className="size-3.5 animate-spin text-primary" />
              ) : (
                <span className="size-3.5 rounded-full border" />
              )}
              {label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
