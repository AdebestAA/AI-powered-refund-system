import { z } from "zod";

export const refundRequestSchema = z.object({
  orderId: z.string().min(1, "Choose an order"),
  message: z
    .string()
    .trim()
    .min(10, "Tell us a little more (at least 10 characters)")
    .max(1500, "Keep it under 1500 characters"),
});

export const reviewSchema = z.object({
  status: z.enum(["approved", "denied"]),
  note: z.string().trim().min(3, "Add a short note explaining your decision").max(500),
});

export type RefundRequestValues = z.infer<typeof refundRequestSchema>;
export type ReviewValues = z.infer<typeof reviewSchema>;
