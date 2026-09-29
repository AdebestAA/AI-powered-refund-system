import { useEffect, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { BookOpen, PackageSearch, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { OrderCard } from "@/components/support/order-card";
import { RefundComposer } from "@/components/support/refund-composer";
import {
  CustomerBubble,
  DecisionCard,
  ThinkingBubble,
  WelcomeMessage,
} from "@/components/support/conversation";
import useSession from "@/hooks/auth/useSession";
import useMyOrders from "@/hooks/refunds/useMyOrders";
import useMyRefunds from "@/hooks/refunds/useMyRefunds";
import useSubmitRefund from "@/hooks/refunds/useSubmitRefund";
import {
  refundRequestSchema,
  type RefundRequestValues,
} from "@/schemas/refund.schema";

export function SupportPage() {
  const { user } = useSession();
  const {
    data: ordersResponse,
    isPending: ordersLoading,
    isSuccess: ordersLoaded,
  } = useMyOrders();
  const { data: refundsResponse, isPending: refundsLoading } = useMyRefunds();
  const orders = ordersResponse?.data ?? [];
  const refunds = refundsResponse?.data ?? [];

  const submit = useSubmitRefund();
  const scrollRef = useRef<HTMLDivElement>(null);

  const history = [...refunds].reverse();

  const form = useForm<RefundRequestValues>({
    resolver: zodResolver(refundRequestSchema),
    defaultValues: { orderId: "", message: "" },
  });
  const selectedOrderId = useWatch({ control: form.control, name: "orderId" });

  const onSubmit = (values: RefundRequestValues) =>
    submit.mutate(values, {
      onSuccess: () => form.reset({ orderId: "", message: "" }),
    });

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [history.length, submit.isPending]);

  const pendingOrder = orders.find(
    (order) => order.id === submit.variables?.orderId,
  );

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:h-[calc(100svh-4rem)] lg:grid-cols-[minmax(320px,380px)_1fr] lg:py-8">
      <aside className="flex min-h-0 flex-col">
        <div className="mb-4">
          <h1 className="text-xl font-semibold tracking-tight">Your orders</h1>
          <p className="text-sm text-muted-foreground">
            Pick an order to start a refund request.
          </p>
        </div>

        <div className="-mx-1 min-h-0 flex-1 space-y-3 overflow-y-auto px-1 pb-2">
          {ordersLoading &&
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-40 w-full rounded-xl" />
            ))}

          {ordersLoaded && orders.length === 0 && (
            <div className="rounded-xl border border-dashed p-6 text-center">
              <PackageSearch className="mx-auto size-8 text-muted-foreground" />
              <p className="mt-3 text-sm font-medium">
                No orders on this account
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                To try the assistant, sign in with a demo customer such as{" "}
                <span className="font-mono">ada@resolve.dev</span> /{" "}
                <span className="font-mono">Password123!</span>
              </p>
            </div>
          )}

          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              selected={order.id === selectedOrderId}
              onSelect={() => form.setValue("orderId", order.id)}
            />
          ))}
        </div>

        <div className="mt-3 flex items-center gap-3 rounded-xl bg-accent/70 p-3 text-xs text-accent-foreground">
          <BookOpen className="size-4 shrink-0" />
          <span className="flex-1">
            Refunds are decided against our published policy.
          </span>
          <Button
            variant="link"
            size="sm"
            className="h-auto p-0 text-xs"
            asChild
          >
            <Link to="/policy">Read it</Link>
          </Button>
        </div>
      </aside>

      <section className="flex min-h-[70svh] flex-col overflow-hidden rounded-2xl border bg-card shadow-sm lg:min-h-0">
        <header className="flex items-center justify-between border-b px-5 py-3.5">
          <div>
            <h2 className="text-sm font-semibold">Refund assistant</h2>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="size-1.5 rounded-full bg-success" /> Online ·
              usually replies in seconds
            </p>
          </div>
          <span className="hidden items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground sm:inline-flex">
            <ShieldCheck className="size-3.5" /> Policy-checked decisions
          </span>
        </header>

        <div
          ref={scrollRef}
          className="min-h-0 flex-1 space-y-6 overflow-y-auto bg-dots px-4 py-6 sm:px-6"
        >
          {user && <WelcomeMessage name={user.name} />}

          {refundsLoading && (
            <Skeleton className="ml-auto h-16 w-2/3 rounded-2xl" />
          )}

          {history.map((refund) => (
            <div key={refund.id} className="space-y-4">
              <CustomerBubble
                message={refund.message}
                orderNumber={refund.orderNumber}
                time={refund.createdAt}
              />
              <DecisionCard refund={refund} />
            </div>
          ))}

          {submit.isPending && submit.variables && (
            <div className="space-y-4">
              <CustomerBubble
                message={submit.variables.message}
                orderNumber={pendingOrder?.orderNumber ?? ""}
              />
              <ThinkingBubble />
            </div>
          )}
        </div>

        <RefundComposer
          form={form}
          orders={orders}
          pending={submit.isPending}
          onSubmit={onSubmit}
        />
      </section>
    </div>
  );
}
