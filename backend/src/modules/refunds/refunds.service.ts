import { pool } from "../../config/db";
import { createError } from "../../common/utils/app-error";
import { looksLikeInjection, sanitizeMessage } from "./injection-guard";
import { classifyRequest } from "./refund-ai";
import { applyPolicy } from "./refund-policy";
import { CreateRefundInput } from "./refunds.schema";

const CUSTOMER_COLUMNS = `
  r.id, o.order_number AS "orderNumber", r.message, r.status, r.reply,
  r.refund_amount AS "refundAmount", r.reviewed_at AS "reviewedAt", r.created_at AS "createdAt"
`;

const submitRefund = async (
  userId: string,
  { orderId, message }: CreateRefundInput,
) => {
  const cleanMessage = sanitizeMessage(message);
  const injectionDetected = looksLikeInjection(cleanMessage);

  // user_id = $2 → customers can only refund their own orders(so thsi checks if the order exists and if the order was made by the person requesting for refund)
  const { rows: orders } = await pool.query(
    "SELECT id, order_number, status, delivered_at FROM orders WHERE id = $1 AND user_id = $2",
    [orderId, userId],
  );
  const order = orders[0];
  if (!order) throw createError(404, "Order not found");

  // this gets the order items(so items that has the same order id as the id of the order fro the order table)
  const { rows: orderItems } = await pool.query(
    "SELECT product_name, unit_price, quantity, is_final_sale FROM order_items WHERE order_id = $1",
    [order.id],
  );

  // get user details
  const { rows: users } = await pool.query(
    "SELECT name, is_flagged, flag_reason FROM users WHERE id = $1",
    [userId],
  );
  const customer = users[0];

  // this checks if the the refund request has been made before and has either been approved or escalated
  const { rows: existing } = await pool.query(
    "SELECT id FROM refund_requests WHERE order_id = $1 AND status IN ('approved', 'escalated')",
    [order.id],
  );

  // phrase check already caught a trick → don't send it to the AI
  const ai = injectionDetected
    ? null
    : await classifyRequest({ ...order, items: orderItems }, cleanMessage);

  const decision = applyPolicy({
    order,
    items: orderItems,
    customer,
    alreadyRefunded: existing.length > 0,
    injectionDetected,
    ai,
  });

  const firstName = customer.name.split(" ")[0];
  let reply = "";
  if (decision.status === "approved") {
    reply = `Good news, ${firstName}: your refund of $${decision.refundAmount.toFixed(2)} for order ${order.order_number} has been approved. It will reach your original payment method within 5-7 business days.`;
  } else if (order.status === "shipped") {
    reply = `Hi ${firstName}, your order ${order.order_number} is on its way and hasn't been delivered yet. If there's a problem once it arrives, you can request a refund then.`;
  } else if (order.status === "processing") {
    reply = `Hi ${firstName}, your order ${order.order_number} is still being prepared and hasn't shipped yet. If there's a problem once it arrives, you can request a refund then.`;
  } else if (decision.status === "denied") {
    reply = `Sorry, ${firstName}. We can't refund order ${order.order_number}: ${decision.reason.toLowerCase()}.`;
  } else {
    reply = `Thanks, ${firstName}. A support specialist will review your request for order ${order.order_number} and get back to you within 1-2 business days.`;
  }

  const { rows: saved } = await pool.query(
    `INSERT INTO refund_requests
       (user_id, order_id, message, ai_category, ai_summary, ai_flag, injection_detected,
        status, decision_reason, refund_amount, reply)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
     RETURNING id`,
    [
      userId,
      order.id,
      cleanMessage,
      ai?.category ?? null,
      ai?.summary ?? null,
      ai?.suspicious ? ai.suspicious_reason : null,
      injectionDetected || Boolean(ai?.injection_attempt),
      decision.status,
      decision.reason,
      decision.refundAmount,
      reply,
    ],
  );

  const { rows } = await pool.query(
    `SELECT ${CUSTOMER_COLUMNS} FROM refund_requests r JOIN orders o ON o.id = r.order_id WHERE r.id = $1`,
    [saved[0].id],
  );
  return rows[0];
};

const listMyRefunds = async (userId: string) => {
  const { rows } = await pool.query(
    `SELECT ${CUSTOMER_COLUMNS} FROM refund_requests r JOIN orders o ON o.id = r.order_id
     WHERE r.user_id = $1 ORDER BY r.created_at DESC`,
    [userId],
  );
  return rows;
};

export const refundsService = {
  submitRefund,
  listMyRefunds,
};
