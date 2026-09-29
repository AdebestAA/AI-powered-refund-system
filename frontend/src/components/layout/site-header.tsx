import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";
import { UserMenu } from "@/components/shared/user-menu";
import useSession from "@/hooks/auth/useSession";
import { cn } from "@/lib/utils";

const navClass = ({ isActive }: { isActive: boolean }) =>
  cn("rounded-md px-3 py-1.5 text-sm font-medium transition-colors", isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground");

export function SiteHeader() {
  const { user, isAdmin, isLoading } = useSession();

  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Logo />
          <nav className="hidden items-center gap-1 md:flex">
            <NavLink to="/support" className={navClass}>
              Support
            </NavLink>
            <NavLink to="/policy" className={navClass}>
              Refund policy
            </NavLink>
            {isAdmin && (
              <NavLink to="/admin" className={navClass}>
                Dashboard
              </NavLink>
            )}
          </nav>
        </div>
        {isLoading ? null : user ? (
          <UserMenu />
        ) : (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">Sign in</Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/signup">Create account</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
