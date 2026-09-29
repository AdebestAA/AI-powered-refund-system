import { formatDistanceToNowStrict, format } from "date-fns";
import type { AiCategory } from "@/utils/types";

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export const money = (n: number) => usd.format(n);
export const ago = (d: string | Date) => `${formatDistanceToNowStrict(new Date(d))} ago`;
export const dateTime = (d: string | Date) => format(new Date(d), "MMM d, yyyy · h:mm a");
export const shortDate = (d: string | Date) => format(new Date(d), "MMM d, yyyy");
export const shortDay = (date: string) => format(new Date(`${date}T00:00:00`), "d MMM");

export const daysSince = (d: string | Date) => Math.floor((Date.now() - new Date(d).getTime()) / 86_400_000);

export const CATEGORY_LABELS: Record<AiCategory | "unknown", string> = {
  damaged: "Damaged / defective",
  wrong_item: "Wrong item",
  not_received: "Never arrived",
  changed_mind: "Changed mind",
  other: "Other",
  unknown: "Not classified",
};

export const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");
