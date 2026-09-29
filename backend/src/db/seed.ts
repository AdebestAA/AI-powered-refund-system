import bcrypt from "bcrypt";
import { pool, withTransaction } from "../config/db";
import { ADMIN, DEMO_PASSWORD, customers } from "./seed-data";

const daysAgo = (days: number) =>
  new Date(Date.now() - days * 24 * 60 * 60 * 1000);

const PAST_REFUND_REPLY: Record<string, string> = {
  approved:
    "Your refund has been approved and will be returned to your original payment method within 5-7 business days.",
  denied: "We're unable to approve this refund under our policy.",
  escalated: "Your request has been passed to a specialist for review.",
};

const seed = async () => {
  const demoHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  const adminHash = await bcrypt.hash(ADMIN.password, 10);

  await withTransaction(async (db) => {
    await db.query("TRUNCATE refund_requests, order_items, orders");

    await db.query(
      `INSERT INTO users (name, email, password_hash, role, email_verified_at)
       VALUES ($1, $2, $3, 'admin', now())
       ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, role = 'admin'`,
      [ADMIN.name, ADMIN.email, adminHash],
    );

    for (const c of customers) {
      const { rows: users } = await db.query<{ id: string }>(
        `INSERT INTO users (name, email, password_hash, role, email_verified_at, phone, is_flagged, flag_reason, created_at)
         VALUES ($1, $2, $3, 'customer', now(), $4, $5, $6, $7)
         ON CONFLICT (email) DO UPDATE SET
           name = EXCLUDED.name, password_hash = EXCLUDED.password_hash, phone = EXCLUDED.phone,
           is_flagged = EXCLUDED.is_flagged, flag_reason = EXCLUDED.flag_reason, created_at = EXCLUDED.created_at
         RETURNING id`,
        [
          c.name,
          c.email,
          demoHash,
          c.phone,
          Boolean(c.flagged),
          c.flagged ?? null,
          daysAgo(c.customerSinceDaysAgo),
        ],
      );
      const userId = users[0].id;

      const orderIds = new Map<string, { id: string; total: number }>();

      for (const o of c.orders) {
        const total = o.items.reduce(
          (sum, i) => sum + i.price * (i.qty ?? 1),
          0,
        );
        const { rows: orders } = await db.query<{ id: string }>(
          `INSERT INTO orders (order_number, user_id, status, total, placed_at, delivered_at)
           VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
          [
            o.number,
            userId,
            o.status,
            total.toFixed(2),
            daysAgo(o.placedDaysAgo),
            o.deliveredDaysAgo !== undefined
              ? daysAgo(o.deliveredDaysAgo)
              : null,
          ],
        );
        orderIds.set(o.number, { id: orders[0].id, total });

        for (const i of o.items) {
          await db.query(
            `INSERT INTO order_items (order_id, sku, product_name, category, unit_price, quantity, is_final_sale)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
              orders[0].id,
              i.sku,
              i.name,
              i.category,
              i.price,
              i.qty ?? 1,
              Boolean(i.finalSale),
            ],
          );
        }
      }

      for (const r of c.pastRefunds ?? []) {
        const order = orderIds.get(r.orderNumber)!;

        await db.query(
          `INSERT INTO refund_requests
             (user_id, order_id, message, ai_category, ai_summary, status, decision_reason, refund_amount, reply, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          [
            userId,
            order.id,
            r.message,
            r.category,
            "Imported from the old support system.",
            r.status,
            "Historical record",
            r.status === "approved" ? order.total : 0,
            PAST_REFUND_REPLY[r.status],
            daysAgo(r.daysAgo),
          ],
        );
      }
    }
  });

  console.log(`✔ Seeded ${customers.length} customers.`);
  console.log(`  Admin login:     ${ADMIN.email} / ${ADMIN.password}`);
  console.log(
    `  Customer logins: <name>@resolve.dev / ${DEMO_PASSWORD}  (e.g. ada@resolve.dev)`,
  );
};

seed()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
