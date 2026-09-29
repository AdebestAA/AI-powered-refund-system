import { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { BookOpen, Inbox, LayoutDashboard, Menu, MessageSquareText, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Logo } from "@/components/shared/logo";
import { UserMenu } from "@/components/shared/user-menu";
import useAdminStats from "@/hooks/admin/useAdminStats";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/requests", label: "Refund requests", icon: Inbox, badge: true },
  { to: "/admin/customers", label: "Customers", icon: Users },
];

const SECONDARY = [
  { to: "/support", label: "Customer chat", icon: MessageSquareText },
  { to: "/policy", label: "Refund policy", icon: BookOpen },
];

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const { data } = useAdminStats();
  const pending = data?.data.totals.escalated ?? 0;

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
      isActive ? "bg-sidebar-accent text-white" : "text-sidebar-muted hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
    );

  return (
    <div className="flex h-full flex-col px-3 py-5">
      <div className="px-3">
        <Logo to="/admin" tone="light" />
      </div>
      <p className="mt-8 px-3 text-[11px] font-semibold uppercase tracking-wider text-sidebar-muted/70">Support desk</p>
      <nav className="mt-2 space-y-0.5">
        {NAV.map(({ to, label, icon: Icon, end, badge }) => (
          <NavLink key={to} to={to} end={end} className={linkClass} onClick={onNavigate}>
            <Icon className="size-4" />
            <span className="flex-1">{label}</span>
            {badge && pending > 0 && (
              <span className="rounded-full bg-warning px-1.5 py-px text-[11px] font-semibold text-zinc-900 tabular-nums">{pending}</span>
            )}
          </NavLink>
        ))}
      </nav>
      <p className="mt-8 px-3 text-[11px] font-semibold uppercase tracking-wider text-sidebar-muted/70">Shortcuts</p>
      <nav className="mt-2 space-y-0.5">
        {SECONDARY.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={linkClass} onClick={onNavigate}>
            <Icon className="size-4" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto rounded-xl border border-white/10 bg-white/[0.04] p-3.5 text-xs leading-relaxed text-sidebar-muted">
        <p className="font-medium text-sidebar-foreground">Needs your review</p>
        Requests that couldn't be decided automatically are waiting under Refund requests → Escalated.
      </div>
    </div>
  );
}

export function AdminLayout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-svh bg-background lg:pl-64">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 bg-sidebar lg:block">
        <SidebarNav />
      </aside>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64 border-none bg-sidebar p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SidebarNav onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-xl sm:px-6">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open navigation">
          <Menu />
        </Button>
        <p className="hidden text-sm text-muted-foreground lg:block">
          Support desk <span className="mx-1.5 text-border">/</span>
          <span className="font-medium text-foreground">
            {location.pathname.startsWith("/admin/requests")
              ? "Refund requests"
              : location.pathname.startsWith("/admin/customers")
                ? "Customers"
                : "Overview"}
          </span>
        </p>
        <UserMenu />
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
        <Outlet />
      </main>
    </div>
  );
}
