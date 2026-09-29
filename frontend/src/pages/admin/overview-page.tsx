import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Hourglass,
  Inbox,
  ShieldAlert,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DecisionsChart } from "@/components/admin/decisions-chart";
import { RefundTable } from "@/components/admin/refund-table";
import useAdminRefunds from "@/hooks/admin/useAdminRefunds";
import useAdminStats from "@/hooks/admin/useAdminStats";
import useSession from "@/hooks/auth/useSession";
import { CATEGORY_LABELS, money } from "@/lib/format";
import { cn } from "@/lib/utils";

export function OverviewPage() {
  const { user } = useSession();
  const stats = useAdminStats();
  const recent = useAdminRefunds({ status: "all", search: "" });
  const statsData = stats.data?.data;
  const t = statsData?.totals;
  const maxCategory = Math.max(
    1,
    ...(statsData?.categories.map((c) => c.count) ?? [1]),
  );


  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Good {greeting()}, {user?.name.split(" ")[0]}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Here's how refund requests are being handled.
          </p>
        </div>
        {t && t.escalated > 0 && (
          <Button asChild>
            <Link to="/admin/requests?status=escalated">
              Review {t.escalated} escalated <ArrowRight />
            </Link>
          </Button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi icon={Inbox} label="Total requests" value={t?.total} />
        <Kpi
          icon={CheckCircle2}
          label="Approved"
          value={t?.approved}
          sub={t && `${t.denied} denied`}
        />
        <Kpi
          icon={Hourglass}
          label="Awaiting review"
          value={t?.escalated}
          sub="escalated to a specialist"
          tone={t?.escalated ? "warning" : undefined}
          to="/admin/requests?status=escalated"
        />
        <Kpi
          icon={Wallet}
          label="Refunded"
          value={t && money(t.refundedAmount)}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <Card className="gap-4">
          <CardHeader>
            <CardTitle className="text-base">Decisions</CardTitle>
            <CardDescription>
              Requests per day by outcome, last 14 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            {statsData ? (
              <DecisionsChart daily={statsData.daily} />
            ) : (
              <Skeleton className="h-56 w-full" />
            )}
          </CardContent>
        </Card>

        <Card className="gap-4">
          <CardHeader>
            <CardTitle className="text-base">Why customers ask</CardTitle>
            <CardDescription>By AI category</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {!statsData &&
              Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-full" />
              ))}
            {statsData?.categories.map((c) => (
              <div key={c.category}>
                <div className="mb-1 flex justify-between text-xs">
                  <span>{CATEGORY_LABELS[c.category]}</span>
                  <span className="tabular-nums text-muted-foreground">
                    {c.count}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-primary/80"
                    style={{ width: `${(c.count / maxCategory) * 100}%` }}
                  />
                </div>
              </div>
            ))}
            {t && (
              <div className="!mt-5 flex items-center gap-3 rounded-lg bg-danger-soft p-3 text-xs text-danger-ink">
                <ShieldAlert className="size-4 shrink-0" />
                <span>
                  <strong className="tabular-nums">
                    {t.injectionAttempts}
                  </strong>{" "}
                  manipulation attempt{t.injectionAttempts === 1 ? "" : "s"}{" "}
                  caught and escalated
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="gap-0 overflow-hidden py-0">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div>
            <h2 className="text-base font-semibold">Recent requests</h2>
            <p className="text-sm text-muted-foreground">
              Latest activity across all customers
            </p>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/admin/requests">
              View all <ArrowUpRight />
            </Link>
          </Button>
        </div>
        <RefundTable
          rows={recent.data?.data.slice(0, 6)}
          loading={recent.isPending}
        />
      </Card>
    </div>
  );
}

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "morning" : h < 18 ? "afternoon" : "evening";
}

type KpiProps = {
  icon: typeof Inbox;
  label: string;
  value: string | number | undefined;
  sub?: string | false | undefined;
  tone?: "warning";
  to?: string;
};

function Kpi({ icon: Icon, label, value, sub, tone, to }: KpiProps) {
  const body = (
    <Card
      className={cn(
        "h-full gap-0 p-5 transition-shadow",
        to && "hover:shadow-md",
        tone === "warning" && "border-warning/50 bg-warning-soft/60",
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span
          className={cn(
            "flex size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground",
            tone === "warning" && "bg-warning/20 text-warning-ink",
          )}
        >
          <Icon className="size-4" />
        </span>
      </div>
      {value === undefined ? (
        <Skeleton className="mt-3 h-8 w-24" />
      ) : (
        <p className="mt-2 text-3xl font-semibold tracking-tight tabular-nums">
          {value}
        </p>
      )}
      {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
    </Card>
  );
  return to ? <Link to={to}>{body}</Link> : body;
}
