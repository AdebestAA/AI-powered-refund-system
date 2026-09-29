import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefundTable } from "@/components/admin/refund-table";
import useAdminRefunds from "@/hooks/admin/useAdminRefunds";
import useDebounce from "@/hooks/useDebounce";
import type { AdminRefundFilters } from "@/services/admin";

const STATUSES: AdminRefundFilters["status"][] = ["all", "escalated", "approved", "denied"];

export function RequestsPage() {
  const [params, setParams] = useSearchParams();
  const status = (params.get("status") as AdminRefundFilters["status"]) || "all";

  const [search, setSearch] = useState(params.get("q") ?? "");
  const debouncedSearch = useDebounce(search.trim(), 300);

  const { data, isPending } = useAdminRefunds({ status, search: debouncedSearch });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Refund requests</h1>
        <p className="mt-1 text-sm text-muted-foreground">Every request with its decision and the reasoning behind it.</p>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <Tabs value={status} onValueChange={(value) => setParams(value === "all" ? {} : { status: value })}>
          <TabsList>
            {STATUSES.map((s) => (
              <TabsTrigger key={s} value={s} className="capitalize">
                {s}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="relative w-full sm:w-72">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Customer or order number…"
            className="bg-card pl-9"
          />
        </div>
      </div>

      <Card className="gap-0 overflow-hidden py-0">
        <RefundTable rows={data?.data} loading={isPending} />
      </Card>
    </div>
  );
}
