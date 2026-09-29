import { Link } from "react-router-dom";
import { Flag, KeyRound } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import useAdminCustomers from "@/hooks/admin/useAdminCustomers";
import { initials, shortDate } from "@/lib/format";

export function CustomersPage() {
  const { data, isPending } = useAdminCustomers();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Customers</h1>
          <p className="mt-1 text-sm text-muted-foreground">The mock CRM the refund rules read from.</p>
        </div>
        <p className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2 text-xs text-muted-foreground">
          <KeyRound className="size-3.5" /> Sign in as any customer with <span className="font-mono text-foreground">Password123!</span>
        </p>
      </div>

      <Card className="gap-0 overflow-hidden py-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-5">Customer</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead className="text-right">Orders</TableHead>
              <TableHead className="text-right">Refund requests</TableHead>
              <TableHead className="pr-5">Customer since</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending &&
              Array.from({ length: 8 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={5} className="px-5">
                    <Skeleton className="h-9 w-full" />
                  </TableCell>
                </TableRow>
              ))}
            {data?.data.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="pl-5">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-8">
                      <AvatarFallback className="bg-accent text-xs font-semibold text-accent-foreground">{initials(c.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="flex items-center gap-1.5 text-sm font-medium">
                        {c.name}
                        {c.isFlagged && <Flag className="size-3.5 text-warning-ink" aria-label={`Flagged: ${c.flagReason}`} />}
                      </p>
                      <p className="font-mono text-xs text-muted-foreground">{c.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{c.phone ?? "—"}</TableCell>
                <TableCell className="text-right tabular-nums">{c.orderCount}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {c.refundCount > 0 ? (
                    <Link to={`/admin/requests?q=${encodeURIComponent(c.email)}`} className="font-medium text-primary hover:underline">
                      {c.refundCount}
                    </Link>
                  ) : (
                    <span className="text-muted-foreground">0</span>
                  )}
                </TableCell>
                <TableCell className="pr-5 text-sm text-muted-foreground">{shortDate(c.customerSince)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
