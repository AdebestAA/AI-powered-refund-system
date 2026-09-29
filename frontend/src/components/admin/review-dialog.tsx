import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/shared/form-field";
import useReviewRefund from "@/hooks/admin/useReviewRefund";
import { money } from "@/lib/format";
import { cn } from "@/lib/utils";
import { reviewSchema, type ReviewValues } from "@/schemas/refund.schema";

type Props = { refundId: string; refundAmount: number };

export function ReviewDialog({ refundId, refundAmount }: Props) {
  const [open, setOpen] = useState(false);
  const review = useReviewRefund();
  const { register, handleSubmit, formState, control, setValue, reset } = useForm<ReviewValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { status: "approved", note: "" },
  });
  const status = useWatch({ control, name: "status" });

  const onSubmit = handleSubmit((values) =>
    review.mutate(
      { id: refundId, ...values },
      {
        onSuccess: () => {
          setOpen(false);
          reset();
        },
      },
    ),
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Resolve request</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Resolve this request</DialogTitle>
          <DialogDescription>Your decision and note are saved with the request.</DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div className="grid grid-cols-2 gap-2">
            {(
              [
                { value: "approved", label: "Approve", sub: money(refundAmount), icon: CheckCircle2, active: "border-success bg-success-soft text-success-ink" },
                { value: "denied", label: "Deny", sub: "No refund", icon: XCircle, active: "border-danger bg-danger-soft text-danger-ink" },
              ] as const
            ).map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => setValue("status", o.value)}
                className={cn(
                  "flex items-center gap-3 rounded-xl border-2 p-3 text-left transition-colors",
                  status === o.value ? o.active : "border-border hover:bg-muted",
                )}
              >
                <o.icon className="size-5" />
                <span>
                  <span className="block text-sm font-semibold">{o.label}</span>
                  <span className="block text-xs opacity-75">{o.sub}</span>
                </span>
              </button>
            ))}
          </div>

          <FormField label="Note" htmlFor="note" error={formState.errors.note?.message} hint="Visible to other reviewers, not the customer.">
            <Textarea id="note" rows={3} placeholder="e.g. Photos confirm the damage; high-value approval OK." {...register("note")} />
          </FormField>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={review.isPending} variant={status === "denied" ? "destructive" : "default"}>
              {review.isPending && <Loader2 className="animate-spin" />}
              {status === "approved" ? "Approve refund" : "Deny refund"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
