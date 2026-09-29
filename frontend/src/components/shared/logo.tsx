import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-sm shadow-indigo-500/30",
        className,
      )}
    >
      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12.5l4.5 4.5L19 7.5" />
      </svg>
    </span>
  );
}

export function Logo({ to = "/", tone = "dark" }: { to?: string; tone?: "dark" | "light" }) {
  return (
    <Link to={to} className="flex items-center gap-2.5">
      <LogoMark />
      <span className={cn("text-[15px] font-semibold tracking-tight", tone === "light" ? "text-white" : "text-foreground")}>
        Resolve
      </span>
    </Link>
  );
}
