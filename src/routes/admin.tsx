import { createFileRoute, Link, Outlet, useNavigate, useLocation } from "@tanstack/react-router";
import { useEffect } from "react";
import { BarChart3, CalendarDays, Inbox, LayoutDashboard, LogOut, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/lib/use-admin-auth";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Dashboard administrateur — Infotelcom" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  const { loading, user, isAdmin } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading) return;
    if (!user || !isAdmin) {
      navigate({ to: "/admin/login" });
    }
  }, [loading, user, isAdmin, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        Chargement…
      </div>
    );
  }
  if (!user || !isAdmin) return null;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Déconnecté");
    navigate({ to: "/admin/login" });
  };

  const navItems = [
    { to: "/admin", label: "Vue d'ensemble", icon: LayoutDashboard, exact: true },
    { to: "/admin/submissions", label: "Demandes contact", icon: Inbox },
    { to: "/admin/sessions", label: "Sessions", icon: CalendarDays },
    { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  ] as const;

  return (
    <div className="flex min-h-screen bg-[image:var(--gradient-subtle)]">
      <Toaster />
      <aside className="hidden w-64 shrink-0 border-r border-border bg-card md:flex md:flex-col">
        <div className="flex items-center gap-2 border-b border-border px-5 py-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[image:var(--gradient-primary)] text-primary-foreground">
            <Shield className="h-4 w-4" />
          </span>
          <div>
            <div className="text-sm font-bold text-foreground">Infotelcom</div>
            <div className="text-xs text-muted-foreground">Admin</div>
          </div>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => {
            const isActive = item.exact
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground/80 hover:bg-secondary"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border p-3">
          <div className="px-2 pb-3 text-xs text-muted-foreground truncate" title={user.email ?? ""}>
            {user.email}
          </div>
          <Button variant="outline" size="sm" className="w-full" onClick={handleLogout}>
            <LogOut className="h-4 w-4" /> Déconnexion
          </Button>
          <Link
            to="/"
            className="mt-2 block text-center text-xs text-muted-foreground hover:text-foreground"
          >
            ← Retour au site
          </Link>
        </div>
      </aside>
      <main className="flex-1 overflow-x-auto">
        <header className="flex items-center justify-between border-b border-border bg-card px-6 py-4 md:hidden">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-sm font-bold">Infotelcom Admin</span>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </header>
        <nav className="flex gap-1 overflow-x-auto border-b border-border bg-card px-3 py-2 md:hidden">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="shrink-0 rounded-md px-3 py-1.5 text-xs font-medium text-foreground/80 hover:bg-secondary [&.active]:bg-primary [&.active]:text-primary-foreground"
              activeOptions={{ exact: item.exact }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}