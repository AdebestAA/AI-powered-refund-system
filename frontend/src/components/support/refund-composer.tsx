import { Controller, useWatch, type UseFormReturn } from "react-hook-form";
import { ArrowUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { money } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { RefundRequestValues } from "@/schemas/refund.schema";
import type { Order } from "@/utils/types";

type Props = {
  form: UseFormReturn<RefundRequestValues>;
  orders: Order[];
  pending: boolean;
  onSubmit: (values: RefundRequestValues) => void;
};

const MAX = 1500;

export function RefundComposer({ form, orders, pending, onSubmit }: Props) {
  const { control, register, handleSubmit, formState } = form;
  const message = useWatch({ control, name: "message" }) ?? "";
  const error = formState.errors.orderId?.message ?? formState.errors.message?.message;
  const submit = handleSubmit(onSubmit);

  return (
    <form onSubmit={submit} noValidate className="border-t bg-card/80 p-3 backdrop-blur sm:p-4">
      <Controller
        control={control}
        name="orderId"
        render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger className="w-full bg-background sm:w-72" aria-invalid={!!formState.errors.orderId}>
              <SelectValue placeholder="Which order?" />
            </SelectTrigger>
            <SelectContent>
              {orders.map((order) => (
                <SelectItem key={order.id} value={order.id} disabled={order.refundStatus === "approved" || order.refundStatus === "escalated"}>
                  <span className="font-mono text-xs">{order.orderNumber}</span>
                  <span className="text-muted-foreground">· {money(order.total)}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />

      <div className="relative mt-2">
        <Textarea
          {...register("message")}
          rows={2}
          maxLength={MAX}
          placeholder="Tell us what went wrong…"
          aria-invalid={!!formState.errors.message}
          className="max-h-40 min-h-[72px] resize-none bg-background pr-14"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
        />
        <Button type="submit" size="icon" className="absolute right-2 bottom-2 size-9 rounded-full" disabled={pending} aria-label="Send request">
          {pending ? <Loader2 className="animate-spin" /> : <ArrowUp />}
        </Button>
      </div>

      <div className="mt-1.5 flex items-center justify-between px-1 text-[11px]">
        {error ? (
          <span role="alert" className="font-medium text-danger-ink">
            {error}
          </span>
        ) : (
          <span className="text-muted-foreground">Enter to send · Shift + Enter for a new line</span>
        )}
        <span className={cn("tabular-nums text-muted-foreground", message.length > MAX * 0.9 && "text-warning-ink")}>
          {message.length}/{MAX}
        </span>
      </div>
    </form>
  );
}
