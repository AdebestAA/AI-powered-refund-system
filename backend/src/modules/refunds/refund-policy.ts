import { HUMAN_REVIEW_OVER, REFUND_WINDOW_DAYS } from "../policy/policy";
import type { AiResult } from "./refund-ai";

type PolicyInput = {
  order: { status: string; delivered_at: Date | null };
  items: { unit_price: number; quantity: number; is_final_sale: boolean }[];
  customer: { is_flagged: boolean; flag_reason: string | null };
  alreadyRefunded: boolean;
  injectionDetected: boolean;
  ai: AiResult | null;
};

type Decision = {
  status: "approved" | "denied" | "escalated";
  reason: string;
  refundAmount: number;
};

// rules run top to bottom — the first one that matches decides
export const applyPolicy = ({
  order,
  items,
  customer,
  alreadyRefunded,
  injectionDetected,
  ai,
}: PolicyInput): Decision => {
  const refundableItems = items.filter((item) => !item.is_final_sale);
  const refundAmount = refundableItems.reduce(
    (sum, item) => sum + item.unit_price * item.quantity,
    0,
  );

  const daysSinceDelivery = order.delivered_at
    ? Math.floor(
        (Date.now() - new Date(order.delivered_at).getTime()) /
          (24 * 60 * 60 * 1000),
      )
    : null;

  if (order.status === "cancelled") {
    return {
      status: "denied",
      reason: "Order was cancelled, so nothing was charged",
      refundAmount: 0,
    };
  }
  if (alreadyRefunded) {
    return {
      status: "denied",
      reason: "This order already has a refund (approved or under review)",
      refundAmount: 0,
    };
  }
  if (daysSinceDelivery !== null && daysSinceDelivery > REFUND_WINDOW_DAYS) {
    return {
      status: "denied",
      reason: `Delivered ${daysSinceDelivery} days ago, outside the ${REFUND_WINDOW_DAYS}-day window`,
      refundAmount: 0,
    };
  }
  if (refundableItems.length === 0) {
    return {
      status: "denied",
      reason: "All items in this order are final sale",
      refundAmount: 0,
    };
  }

  if (order.status === "processing") {
    return {
      status: "denied",
      reason: "Order is still being prepared and hasn't shipped yet",
      refundAmount: 0,
    };
  }
  if (order.status === "shipped") {
    return {
      status: "denied",
      reason: "Order is on its way and hasn't been delivered yet",
      refundAmount: 0,
    };
  }

  if (injectionDetected || ai?.injection_attempt) {
    return {
      status: "escalated",
      reason: "Message tried to manipulate the review",
      refundAmount,
    };
  }
  if (customer.is_flagged) {
    return {
      status: "escalated",
      reason: `Account under review: ${customer.flag_reason}`,
      refundAmount,
    };
  }
  if (!ai) {
    return {
      status: "escalated",
      reason:
        "AI was unavailable, so the request couldn't be checked automatically",
      refundAmount,
    };
  }
  if (ai.suspicious) {
    return {
      status: "escalated",
      reason: `Suspicious or conflicting request: ${ai.suspicious_reason}`,
      refundAmount,
    };
  }
  if (refundAmount > HUMAN_REVIEW_OVER) {
    return {
      status: "escalated",
      reason: `Refund of $${refundAmount.toFixed(2)} is over $${HUMAN_REVIEW_OVER}`,
      refundAmount,
    };
  }
  if (ai.category === "not_received") {
    return {
      status: "escalated",
      reason:
        "Delivered order reported as not received — check with the carrier",
      refundAmount,
    };
  }
  if (ai.category === "other") {
    return {
      status: "escalated",
      reason: "Reason doesn't clearly match the refund policy",
      refundAmount,
    };
  }

  // fewer refundable items than items in the order → some were final sale; note it in the reason
  const excluded =
    refundableItems.length < items.length ? " (final-sale items excluded)" : "";
  return {
    status: "approved",
    reason: `${ai.category.replace("_", " ")}, delivered ${daysSinceDelivery} days ago${excluded}`,
    refundAmount,
  };
};
