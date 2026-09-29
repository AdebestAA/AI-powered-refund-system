import { useNavigate } from "react-router-dom";
import { ShieldAlert, TriangleAlert, UserCheck } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { DecisionBadge } from "@/components/shared/decision-badge";
import { CATEGORY_LABELS, ago, money } from "@/lib/format";
import type { AdminRefundListItem } from "@/utils/types";

type Props = { rows: AdminRefundListItem[] | undefined; loading?: boolean };

export function RefundTable({ rows, loading }: Props) {
  const navigate = useNavigate();

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="pl-5">Customer</TableHead>
          <TableHead>Order</TableHead>
          <TableHead>AI category</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="pr-5 text-right">Received</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading &&
          Array.from({ length: 6 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell colSpan={6} className="px-5">
                <Skeleton className="h-9 w-full" />
              </TableCell>
            </TableRow>
          ))}

        {!loading && rows?.length === 0 && (
          <TableRow className="hover:bg-transparent">
            <TableCell colSpan={6} className="py-14 text-center text-sm text-muted-foreground">
              No refund requests found.
            </TableCell>
          </TableRow>
        )}

        {rows?.map((row) => (
          <TableRow key={row.id} className="cursor-pointer" onClick={() => navigate(`/admin/requests/${row.id}`)}>
            <TableCell className="pl-5">
              <p className="text-sm font-medium">{row.customerName}</p>
              <p className="text-xs text-muted-foreground">{row.customerEmail}</p>
            </TableCell>
            <TableCell>
              <span className="font-mono text-[13px]">{row.orderNumber}</span>
            </TableCell>
            <TableCell className="max-w-[240px]">
              <p className="flex items-center gap-1.5 text-sm">
                {CATEGORY_LABELS[row.aiCategory ?? "unknown"]}
                {row.injectionDetected && <ShieldAlert className="size-3.5 text-danger" aria-label="Manipulation attempt" />}
                {row.flagged && <TriangleAlert className="size-3.5 text-warning-ink" aria-label="Flagged by AI" />}
                {row.reviewedAt && <UserCheck className="size-3.5 text-primary" aria-label="Reviewed by admin" />}
              </p>
              <p className="truncate text-xs text-muted-foreground">{row.message}</p>
            </TableCell>
            <TableCell className="text-right text-sm font-medium tabular-nums">{money(row.refundAmount)}</TableCell>
            <TableCell>
              <DecisionBadge status={row.status} />
            </TableCell>
            <TableCell className="pr-5 text-right text-xs text-muted-foreground">{ago(row.createdAt)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
