import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users, CreditCard, Wallet, ShieldCheck, Send } from "lucide-react";

export default function AdminLayout() {
  const navigate = useNavigate();
  const menu = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
    { to: "/admin/users", label: "Users", icon: Users },
    { to: "/admin/transactions", label: "Transactions", icon: CreditCard },
    { to: "/admin/settlements", label: "Settlements", icon: Wallet },
    { to: "/admin/payouts", label: "Payouts", icon: Send },
  ];

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border">
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-sidebar-border">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-sidebar-foreground">PayGateway</h1>
                <p className="text-sm text-sidebar-foreground/60">Super Admin</p>
              </div>
              <ShieldCheck className="h-5 w-5 text-primary" />
            </div>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {menu.map((m) => {
              const Icon = m.icon;
              return (
                <NavLink
                  key={m.to}
                  to={m.to}
                  end={m.end as any}
                  className={({ isActive }) =>
                    cn(
                      "block",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                    )
                  }
                >
                  <div className="flex items-center gap-3 px-3 py-2 rounded-md">
                    <Icon className="h-4 w-4" />
                    <span>{m.label}</span>
                  </div>
                </NavLink>
              );
            })}
          </nav>
          <div className="p-4 border-t border-sidebar-border">
            <Button className="w-full" variant="secondary" onClick={() => navigate("/")}>Back to App</Button>
          </div>
        </div>
      </aside>
      <main className="pl-64">
        <div className="max-w-7xl mx-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
