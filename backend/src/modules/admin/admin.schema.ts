import { z } from "zod";

export const listRefundsQuery = z.object({
  status: z.enum(["all", "approved", "denied", "escalated"]).default("all"),
  search: z.string().trim().max(100).default(""),
});

export const refundIdParams = z.object({ id: z.string().uuid() });

export const reviewRefundSchema = z.object({
  status: z.enum(["approved", "denied"]),
  note: z.string().trim().min(3, "Add a short note explaining your decision").max(500),
});

export type ListRefundsQuery = z.infer<typeof listRefundsQuery>;
export type ReviewRefundInput = z.infer<typeof reviewRefundSchema>;
