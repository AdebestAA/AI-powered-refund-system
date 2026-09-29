import { Request, Response, Router } from "express";
import { pool } from "../../config/db";
import { authenticate } from "../../common/middlewares/auth";
import { sendOk } from "../../common/utils/response";

const listMyOrders = async (req: Request, res: Response) => {
  const userId = req.user!.id;

  const { rows: orders } = await pool.query(
    `SELECT o.id, o.order_number AS "orderNumber", o.status, o.total,
            o.placed_at AS "placedAt", o.delivered_at AS "deliveredAt",
            (SELECT r.status FROM refund_requests r WHERE r.order_id = o.id
             ORDER BY r.created_at DESC LIMIT 1) AS "refundStatus"
     FROM orders o
     WHERE o.user_id = $1
     ORDER BY o.placed_at DESC`,
    [userId],
  );

  const { rows: items } = await pool.query(
    `SELECT oi.id, oi.order_id AS "orderId", oi.product_name AS "productName",
            oi.unit_price AS "unitPrice", oi.quantity, oi.is_final_sale AS "isFinalSale"
     FROM order_items oi
     JOIN orders o ON o.id = oi.order_id
     WHERE o.user_id = $1`,
    [userId],
  );

  for (const order of orders) {
    order.items = items.filter((item) => item.orderId === order.id);
  }

  sendOk(res, orders);
};

export const ordersRoutes = Router();

ordersRoutes.get("/", authenticate, listMyOrders);
