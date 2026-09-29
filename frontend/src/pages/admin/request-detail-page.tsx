import type { ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { AlertTriangle, ArrowLeft, Bot, Gavel, MessageSquare, ShieldAlert, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DecisionBadge } from "@/components/shared/decision-badge";
import { ReviewDialog } from "@/components/admin/review-dialog";
import useAdminRefund from "@/hooks/admin/useAdminRefund";
import { CATEGORY_LABELS, dateTime, daysSince, money, shortDate } from "@/lib/format";

export function RequestDetailPage() {
  const { id } = useParams();
  const { data, isPending, isError } = useAdminRefund(id);
  const r = data?.data;

  if (isPending) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96" />
      </div>
    );
  }
  if (isError || !r) return <p className="text-sm text-danger-ink">Couldn't load this refund request.</p>;

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" size="sm" className="-ml-2 mb-3 text-muted-foreground" asChild>
          <Link to="/admin/requests">
            <ArrowLeft /> All requests
          </Link>
        </Button>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight">{r.customerName}</h1>
              <DecisionBadge status={r.status} size="lg" />
            </div>
            <p className="mt-1.5 text-sm text-muted-foreground">
              <span className="font-mono">{r.orderNumber}</span> · {dateTime(r.createdAt)}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">{r.status === "approved" ? "Refunded" : "Refund amount"}</p>
              <p className="text-2xl font-semibold tabular-nums">{money(r.refundAmount)}</p>
            </div>
            {r.status === "escalated" && <ReviewDialog refundId={r.id} refundAmount={r.refundAmount} />}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card className="gap-4">
          <CardHeader>
            <CardTitle className="text-base">How this was decided</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <Step icon={MessageSquare} title="1. Customer wrote">
              <p className="whitespace-pre-wrap break-words rounded-xl bg-muted px-4 py-3 text-sm leading-relaxed">{r.message}</p>
            </Step>

            <Step icon={Bot} title="2. AI understood">
              {r.aiCategory ? (
                <div className="space-y-2 text-sm">
                  <p>
                    Category: <strong>{CATEGORY_LABELS[r.aiCategory]}</strong>
                  </p>
                  {r.aiSummary && <p className="text-muted-foreground">{r.aiSummary}</p>}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">AI was unavailable for this request.</p>
              )}
              {r.aiFlag && (
                <p className="mt-2 flex gap-2 rounded-lg bg-warning-soft p-2.5 text-xs text-warning-ink">
                  <AlertTriangle className="mt-px size-3.5 shrink-0" /> Flagged: {r.aiFlag}
                </p>
              )}
              {r.injectionDetected && (
                <p className="mt-2 flex gap-2 rounded-lg bg-danger-soft p-2.5 text-xs text-danger-ink">
                  <ShieldAlert className="mt-px size-3.5 shrink-0" /> The message tried to manipulate the review.
                </p>
              )}
            </Step>

            <Step icon={Gavel} title="3. Policy decided">
              <p className="text-sm">
                <DecisionBadge status={r.adminNote ? "escalated" : r.status} /> <span className="ml-1">{r.decisionReason}</span>
              </p>
            </Step>

            <Step icon={MessageSquare} title={r.reviewedAt ? "4. Customer was told (after your review)" : "4. Customer was told"}>
              <p className="rounded-xl border px-4 py-3 text-sm leading-relaxed">{r.reply}</p>
            </Step>

            {r.reviewedAt && (
              <Step icon={UserCheck} title="5. Admin review">
                <p className="text-sm">
                  <strong className="capitalize">{r.status}</strong> by {r.reviewedBy ?? "an admin"} · {dateTime(r.reviewedAt)}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{r.adminNote}</p>
              </Step>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="gap-4">
            <CardHeader>
              <CardTitle className="text-base">Order {r.orderNumber}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <Row label="Status" value={<span className="capitalize">{r.orderStatus}</span>} />
              <Row label="Placed" value={shortDate(r.placedAt)} />
              <Row label="Delivered" value={r.deliveredAt ? `${shortDate(r.deliveredAt)} (${daysSince(r.deliveredAt)}d ago)` : "—"} />
              <div className="overflow-hidden rounded-lg border">
                {r.items.map((item) => (
                  <div key={item.productName} className="flex items-center justify-between gap-3 border-b px-3 py-2 last:border-0">
                    <span>
                      {item.productName}
                      {item.isFinalSale && <span className="ml-2 text-xs text-danger-ink">final sale</span>}
                    </span>
                    <span className="tabular-nums text-muted-foreground">{money(item.unitPrice * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <Row label="Order total" value={money(r.orderTotal)} />
            </CardContent>
          </Card>

          <Card className="gap-4">
            <CardHeader>
              <CardTitle className="text-base">Customer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <Row label="Name" value={r.customerName} />
              <Row label="Email" value={r.customerEmail} />
              {r.customerFlagged && (
                <p className="flex gap-2 rounded-lg bg-warning-soft p-2.5 text-xs text-warning-ink">
                  <AlertTriangle className="mt-px size-3.5 shrink-0" /> Account flagged: {r.customerFlagReason}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Step({ icon: Icon, title, children }: { icon: typeof Bot; title: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        <Icon className="size-3.5" /> {title}
      </p>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="truncate text-right font-medium">{value}</span>
    </div>
  );
}
