import { LayoutDashboard, LogOut, MessageSquareText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useLogout from "@/hooks/auth/useLogout";
import useSession from "@/hooks/auth/useSession";
import { initials } from "@/lib/format";
import { cn } from "@/lib/utils";

export function UserMenu({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const { user, isAdmin } = useSession();
  const logout = useLogout();
  const navigate = useNavigate();
  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "flex items-center gap-2.5 rounded-full p-0.5 pr-3 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
          tone === "light" ? "hover:bg-sidebar-accent" : "hover:bg-muted",
        )}
      >
        <Avatar className="size-8">
          <AvatarFallback className="bg-gradient-to-br from-indigo-100 to-violet-100 text-xs font-semibold text-indigo-700">
            {initials(user.name)}
          </AvatarFallback>
        </Avatar>
        <span className={cn("hidden text-sm font-medium sm:block", tone === "light" && "text-sidebar-foreground")}>
          {user.name.split(" ")[0]}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <p className="text-sm font-medium">{user.name}</p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => navigate("/support")}>
          <MessageSquareText /> Support chat
        </DropdownMenuItem>
        {isAdmin && (
          <DropdownMenuItem onSelect={() => navigate("/admin")}>
            <LayoutDashboard /> Admin dashboard
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onSelect={() => logout.mutate()}
        >
          <LogOut /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
