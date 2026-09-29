import { CheckCircle2, CircleAlert, XCircle } from "lucide-react";
import type { RefundStatus } from "@/utils/types";

export const DECISION_META: Record<RefundStatus, { label: string; icon: typeof CheckCircle2; className: string; dot: string }> = {
  approved: {
    label: "Approved",
    icon: CheckCircle2,
    className: "bg-success-soft text-success-ink ring-success/25",
    dot: "bg-success",
  },
  denied: {
    label: "Denied",
    icon: XCircle,
    className: "bg-danger-soft text-danger-ink ring-danger/25",
    dot: "bg-danger",
  },
  escalated: {
    label: "Escalated",
    icon: CircleAlert,
    className: "bg-warning-soft text-warning-ink ring-warning/35",
    dot: "bg-warning",
  },
};
