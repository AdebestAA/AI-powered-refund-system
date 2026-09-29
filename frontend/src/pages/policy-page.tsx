import { CheckCircle2, CircleAlert, Info, XCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import usePolicy from "@/hooks/refunds/usePolicy";
import { shortDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Policy } from "@/utils/types";

const OUTCOME: Record<Policy["rules"][number]["outcome"], { icon: typeof Info; label: string; className: string }> = {
  approved: { icon: CheckCircle2, label: "Qualifies", className: "bg-success-soft text-success-ink" },
  denied: { icon: XCircle, label: "Not eligible", className: "bg-danger-soft text-danger-ink" },
  escalated: { icon: CircleAlert, label: "Human review", className: "bg-warning-soft text-warning-ink" },
  info: { icon: Info, label: "Requirement", className: "bg-muted text-muted-foreground" },
};

export function PolicyPage() {
  const { data: response, isPending } = usePolicy();
  const data = response?.data;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      {isPending || !data ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-20 w-full" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : (
        <>
          <p className="text-sm font-medium text-primary">
            Version {data.version} · effective {shortDate(data.effectiveDate)}
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight">{data.title}</h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{data.summary}</p>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-2">
            <Stat value={`${data.thresholds.refundWindowDays} days`} label="to request a refund after delivery" />
            <Stat value={`$${data.thresholds.humanReviewThreshold}`} label="refunds above this are reviewed by a person" />
          </div>

          <ol className="mt-10 space-y-3">
            {data.rules.map((rule, i) => {
              const o = OUTCOME[rule.outcome];
              return (
                <li key={rule.id} className="rounded-2xl border bg-card p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="font-semibold">
                      <span className="mr-2 font-mono text-sm text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                      {rule.title}
                    </h2>
                    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium", o.className)}>
                      <o.icon className="size-3.5" /> {o.label}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{rule.body}</p>
                </li>
              );
            })}
          </ol>
        </>
      )}
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border bg-card p-5">
      <p className="text-2xl font-semibold tracking-tight">{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
