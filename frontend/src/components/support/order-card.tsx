import { CheckCircle2, Clock, Package, Truck, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DecisionBadge } from "@/components/shared/decision-badge";
import { daysSince, money, shortDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Order, OrderStatus } from "@/utils/types";

const STATUS_META: Record<OrderStatus, { label: string; icon: typeof Package; className: string }> = {
  delivered: { label: "Delivered", icon: CheckCircle2, className: "text-success-ink bg-success-soft" },
  shipped: { label: "In transit", icon: Truck, className: "text-sky-700 bg-sky-50" },
  processing: { label: "Processing", icon: Clock, className: "text-zinc-600 bg-zinc-100" },
  cancelled: { label: "Cancelled", icon: XCircle, className: "text-zinc-500 bg-zinc-100" },
};

type Props = { order: Order; selected: boolean; onSelect: () => void };

export function OrderCard({ order, selected, onSelect }: Props) {
  const meta = STATUS_META[order.status];
  const days = order.deliveredAt ? daysSince(order.deliveredAt) : null;

  return (
    <div
      className={cn(
        "rounded-xl border bg-card p-4 transition-all",
        selected ? "border-primary/50 shadow-md shadow-primary/5 ring-2 ring-primary/15" : "hover:border-foreground/15 hover:shadow-sm",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[13px] font-medium">{order.orderNumber}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Placed {shortDate(order.placedAt)}
            {days !== null && ` · delivered ${days === 0 ? "today" : `${days}d ago`}`}
          </p>
        </div>
        <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium", meta.className)}>
          <meta.icon className="size-3" /> {meta.label}
        </span>
      </div>

      <ul className="mt-3 space-y-1.5">
        {order.items.map((item) => (
          <li key={item.id} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex min-w-0 items-center gap-2">
              <span className="truncate">{item.productName}</span>
              {item.isFinalSale && (
                <span className="shrink-0 rounded bg-zinc-100 px-1.5 py-px text-[10px] font-semibold uppercase tracking-wide text-zinc-600">
                  Final sale
                </span>
              )}
            </span>
            <span className="shrink-0 tabular-nums text-muted-foreground">{money(item.unitPrice * item.quantity)}</span>
          </li>
        ))}
      </ul>

      <div className="mt-3 flex items-center justify-between border-t pt-3">
        <span className="text-sm font-semibold tabular-nums">{money(order.total)}</span>
        {order.refundStatus === "approved" || order.refundStatus === "escalated" ? (
          <DecisionBadge status={order.refundStatus} />
        ) : (
          <Button size="sm" variant={selected ? "default" : "outline"} className="h-7 text-xs" onClick={onSelect}>
            {selected ? "Selected" : "Request refund"}
          </Button>
        )}
      </div>
    </div>
  );
}
