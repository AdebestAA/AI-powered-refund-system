import { cn } from "@/lib/utils";
import { DECISION_META } from "@/lib/decision-meta";
import type { RefundStatus } from "@/utils/types";

export function DecisionBadge({ status, size = "sm", className }: { status: RefundStatus; size?: "sm" | "lg"; className?: string }) {
  const meta = DECISION_META[status];
  const Icon = meta.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium ring-1 ring-inset",
        size === "lg" ? "px-3 py-1 text-sm" : "px-2 py-0.5 text-xs",
        meta.className,
        className,
      )}
    >
      <Icon className={size === "lg" ? "size-4" : "size-3.5"} />
      {meta.label}
    </span>
  );
}
