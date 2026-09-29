import { z } from "zod";

export const createRefundSchema = z.object({
  orderId: z.string().uuid("Choose an order"),
  message: z
    .string()
    .trim()
    .min(10, "Tell us a little more (at least 10 characters)")
    .max(1500, "Please keep your message under 1500 characters"),
});

export type CreateRefundInput = z.infer<typeof createRefundSchema>;
