import { pool } from "../../config/db";
import { createError } from "../../common/utils/app-error";
import { ListRefundsQuery, ReviewRefundInput } from "./admin.schema";

const getStats = async () => {
  const { rows: totals } = await pool.query(`
    SELECT count(*)::int                                          AS total,
           count(*) FILTER (WHERE status = 'approved')::int       AS approved,
           count(*) FILTER (WHERE status = 'denied')::int         AS denied,
           count(*) FILTER (WHERE status = 'escalated')::int      AS escalated,
           count(*) FILTER (WHERE injection_detected)::int        AS "injectionAttempts",
           COALESCE(sum(refund_amount) FILTER (WHERE status = 'approved'), 0)::float AS "refundedAmount"
    FROM refund_requests
  `);

  const { rows: daily } = await pool.query(`
    SELECT to_char(day, 'YYYY-MM-DD') AS date,
           count(r.id) FILTER (WHERE r.status = 'approved')::int  AS approved,
           count(r.id) FILTER (WHERE r.status = 'denied')::int    AS denied,
           count(r.id) FILTER (WHERE r.status = 'escalated')::int AS escalated
    FROM generate_series(current_date - 13, current_date, interval '1 day') AS day
    LEFT JOIN refund_requests r ON r.created_at::date = day::date
    GROUP BY day ORDER BY day
  `);

  const { rows: categories } = await pool.query(`
    SELECT COALESCE(ai_category, 'unknown') AS category, count(*)::int AS count
    FROM refund_requests GROUP BY 1 ORDER BY 2 DESC
  `);

  return { totals: totals[0], daily, categories };
};

const listRefunds = async ({ status, search }: ListRefundsQuery) => {
  const { rows } = await pool.query(
    `SELECT r.id, r.status, r.ai_category AS "aiCategory", r.refund_amount AS "refundAmount",
            r.message, r.injection_detected AS "injectionDetected", (r.ai_flag IS NOT NULL) AS "flagged",
            r.reviewed_at AS "reviewedAt", r.created_at AS "createdAt",
            u.name AS "customerName", u.email AS "customerEmail", o.order_number AS "orderNumber"
     FROM refund_requests r
     JOIN users u ON u.id = r.user_id
     JOIN orders o ON o.id = r.order_id
     WHERE ($1 = 'all' OR r.status = $1)
       AND ($2 = '' OR u.name ILIKE '%' || $2 || '%' OR u.email ILIKE '%' || $2 || '%' OR o.order_number ILIKE '%' || $2 || '%')
     ORDER BY r.created_at DESC
     LIMIT 100`,
    [status, search],
  );
  return rows;
};

const getRefund = async (id: string) => {
  const { rows } = await pool.query(
    `SELECT r.id, r.status, r.message, r.ai_category AS "aiCategory", r.ai_summary AS "aiSummary",
            r.ai_flag AS "aiFlag", r.injection_detected AS "injectionDetected",
            r.decision_reason AS "decisionReason", r.refund_amount AS "refundAmount", r.reply,
            r.admin_note AS "adminNote", r.reviewed_at AS "reviewedAt", reviewer.name AS "reviewedBy",
            r.created_at AS "createdAt",
            u.name AS "customerName", u.email AS "customerEmail", u.is_flagged AS "customerFlagged",
            u.flag_reason AS "customerFlagReason",
            o.order_number AS "orderNumber", o.status AS "orderStatus", o.total AS "orderTotal",
            o.placed_at AS "placedAt", o.delivered_at AS "deliveredAt", o.id AS "orderId"
     FROM refund_requests r
     JOIN users u ON u.id = r.user_id
     JOIN orders o ON o.id = r.order_id
     LEFT JOIN users reviewer ON reviewer.id = r.reviewed_by
     WHERE r.id = $1`,
    [id],
  );
  const refund = rows[0];
  if (!refund) throw createError(404, "Refund request not found");

  const { rows: items } = await pool.query(
    `SELECT product_name AS "productName", unit_price AS "unitPrice", quantity, is_final_sale AS "isFinalSale"
     FROM order_items WHERE order_id = $1`,
    [refund.orderId],
  );

  return { ...refund, items };
};

const reviewRefund = async (
  id: string,
  adminId: string,
  { status, note }: ReviewRefundInput,
) => {
  const { rows } = await pool.query(
    `SELECT r.status, r.refund_amount, u.name, o.order_number
     FROM refund_requests r
     JOIN users u ON u.id = r.user_id
     JOIN orders o ON o.id = r.order_id
     WHERE r.id = $1`,
    [id],
  );
  const refund = rows[0];
  if (!refund) throw createError(404, "Refund request not found");
  if (refund.status !== "escalated")
    throw createError(409, "Only escalated requests can be reviewed");

  const refundAmount = status === "approved" ? refund.refund_amount : 0;

  const firstName = refund.name.split(" ")[0];
  const reply =
    status === "approved"
      ? `Good news, ${firstName}: after reviewing your request, we've approved a refund of $${refundAmount.toFixed(2)} for order ${refund.order_number}. It will reach your original payment method within 5-7 business days.`
      : `Hi ${firstName}, after reviewing your request for order ${refund.order_number}, we're unable to approve a refund under our policy.`;

  await pool.query(
    `UPDATE refund_requests
     SET status = $2, refund_amount = $3, admin_note = $4, reviewed_by = $5, reviewed_at = now(), reply = $6
     WHERE id = $1`,
    [id, status, refundAmount, note, adminId, reply],
  );

  return getRefund(id);
};

const listCustomers = async () => {
  const { rows } = await pool.query(`
    SELECT u.id, u.name, u.email, u.phone, u.is_flagged AS "isFlagged", u.flag_reason AS "flagReason",
           u.created_at AS "customerSince",
           (SELECT count(*)::int FROM orders o WHERE o.user_id = u.id) AS "orderCount",
           (SELECT count(*)::int FROM refund_requests r WHERE r.user_id = u.id) AS "refundCount"
    FROM users u
    WHERE u.role = 'customer'
    ORDER BY u.name
  `);
  return rows;
};

export const adminService = {
  getStats,
  listRefunds,
  getRefund,
  reviewRefund,
  listCustomers,
};
