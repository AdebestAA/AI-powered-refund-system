export type typeResponse<T> = {
  status: "ok" | "error";
  message?: string;
  data: T;
};

export type Role = "customer" | "admin";

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  emailVerified: boolean;
  createdAt: string;
};

export type Session = { accessToken: string; user: User };

export type RefundStatus = "approved" | "denied" | "escalated";

export type AiCategory =
  | "damaged"
  | "wrong_item"
  | "not_received"
  | "changed_mind"
  | "other";

export type OrderStatus = "processing" | "shipped" | "delivered" | "cancelled";

export type OrderItem = {
  id: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  isFinalSale: boolean;
};

export type Order = {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  total: number;
  placedAt: string;
  deliveredAt: string | null;
  refundStatus: RefundStatus | null;
  items: OrderItem[];
};

export type RefundRequest = {
  id: string;
  orderNumber: string;
  message: string;
  status: RefundStatus;
  reply: string;
  refundAmount: number;
  reviewedAt: string | null;
  createdAt: string;
};

export type CreateRefundPayload = { orderId: string; message: string };

export type AdminStats = {
  totals: {
    total: number;
    approved: number;
    denied: number;
    escalated: number;
    injectionAttempts: number;
    refundedAmount: number;
  };
  daily: {
    date: string;
    approved: number;
    denied: number;
    escalated: number;
  }[];
  categories: { category: AiCategory | "unknown"; count: number }[];
};

export type AdminRefundListItem = {
  id: string;
  status: RefundStatus;
  aiCategory: AiCategory | null;
  refundAmount: number;
  message: string;
  injectionDetected: boolean;
  flagged: boolean;
  reviewedAt: string | null;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  orderNumber: string;
};

export type AdminRefundDetail = {
  id: string;
  status: RefundStatus;
  message: string;
  aiCategory: AiCategory | null;
  aiSummary: string | null;
  aiFlag: string | null;
  injectionDetected: boolean;
  decisionReason: string;
  refundAmount: number;
  reply: string;
  adminNote: string | null;
  reviewedAt: string | null;
  reviewedBy: string | null;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  customerFlagged: boolean;
  customerFlagReason: string | null;
  orderNumber: string;
  orderStatus: OrderStatus;
  orderTotal: number;
  placedAt: string;
  deliveredAt: string | null;
  items: Omit<OrderItem, "id">[];
};

export type AdminCustomer = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  isFlagged: boolean;
  flagReason: string | null;
  customerSince: string;
  orderCount: number;
  refundCount: number;
};

export type Policy = {
  title: string;
  version: string;
  effectiveDate: string;
  summary: string;
  rules: {
    id: string;
    title: string;
    body: string;
    outcome: "approved" | "denied" | "escalated" | "info";
  }[];
  thresholds: { refundWindowDays: number; humanReviewThreshold: number };
};
