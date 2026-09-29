export const REFUND_WINDOW_DAYS = 30;
export const HUMAN_REVIEW_OVER = 500;

export const POLICY_DOCUMENT = {
  title: "Refund Policy",
  version: "2026.1",
  effectiveDate: "2026-01-01",
  summary: `If something isn't right, most orders can be refunded within ${REFUND_WINDOW_DAYS} days of delivery. Requests are checked automatically against the rules below; anything unusual goes to a member of our support team.`,
  thresholds: { refundWindowDays: REFUND_WINDOW_DAYS, humanReviewThreshold: HUMAN_REVIEW_OVER },
  rules: [
    {
      id: "DELIVERED",
      title: "Order must be delivered",
      body: "Cancelled orders were never charged, so there is nothing to refund. Orders that are still being prepared or on their way can be refunded once they arrive.",
      outcome: "info",
    },
    {
      id: "WINDOW",
      title: `${REFUND_WINDOW_DAYS}-day refund window`,
      body: `Orders delivered more than ${REFUND_WINDOW_DAYS} days ago can't be refunded.`,
      outcome: "denied",
    },
    {
      id: "FINAL_SALE",
      title: "Final sale items",
      body: "Items marked Final Sale can't be refunded. Other items in the same order still can.",
      outcome: "denied",
    },
    {
      id: "ONE_REFUND",
      title: "One refund per order",
      body: "An order that has already been refunded, or is being reviewed, can't be refunded again.",
      outcome: "denied",
    },
    {
      id: "QUALIFYING",
      title: "Damaged or incorrect items",
      body: "Items that arrive damaged or aren't what you ordered qualify for a refund. Changing your mind is also accepted within the window.",
      outcome: "approved",
    },
    {
      id: "HIGH_VALUE",
      title: `Refunds over $${HUMAN_REVIEW_OVER}`,
      body: `Any refund over $${HUMAN_REVIEW_OVER} is reviewed by a member of our team first.`,
      outcome: "escalated",
    },
    {
      id: "NOT_RECEIVED",
      title: "Missing deliveries",
      body: "If an order shows as delivered but never arrived, we check with the carrier before refunding.",
      outcome: "escalated",
    },
    {
      id: "SUSPICIOUS",
      title: "Suspicious or conflicting requests",
      body: "Requests that don't match our order records, come from an account under review, or try to manipulate the system are reviewed by a specialist.",
      outcome: "escalated",
    },
  ],
};

export const POLICY_TEXT = POLICY_DOCUMENT.rules.map((rule) => `- ${rule.title}: ${rule.body}`).join("\n");
