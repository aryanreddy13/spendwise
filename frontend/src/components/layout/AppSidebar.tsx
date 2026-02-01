import { Home, CreditCard, Target, PieChart, Settings, ChevronLeft, ChevronRight, Wallet, Calendar, TrendingUp } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';

import { Link } from 'react-router-dom';

export const AppSidebar = () => {
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);

  const mainNavItems = [
    { to: '/dashboard', icon: Home, label: t.nav.dashboard },
    { to: '/insights', icon: PieChart, label: t.nav.insights },
    { to: '/expenses', icon: CreditCard, label: t.nav.expenses },
    { to: '/budgets', icon: Wallet, label: t.nav.budgets },
    { to: '/goals', icon: Target, label: t.nav.goals },
    { to: '/stocks', icon: TrendingUp, label: t.nav.stocks },
    { to: '/subscriptions', icon: Calendar, label: t.nav.subscriptions },
  ];

  return (
    <aside className={cn(
      "h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header with Text Logo */}
      {/* Header with Text Logo */}
      <div className="p-4 border-b border-sidebar-border flex items-center justify-between h-[70px]">
        <Link to="/dashboard" className="outline-none">
          {!collapsed ? (
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="SpendWise Logo" className="h-[30px] w-auto object-contain" />
              <h1 className="text-xl font-bold text-primary tracking-tight">
                SpendWise
              </h1>
            </div>
          ) : (
            <div className="flex justify-center w-full">
              <img src="/logo.png" alt="S" className="h-[30px] w-auto object-contain" />
            </div>
          )}
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {mainNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
              collapsed && "justify-center px-2"
            )}
            activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
          >
            <item.icon className="h-5 w-5 shrink-0" strokeWidth={2} />
            {!collapsed && <span className="text-sm">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="p-2 border-t border-sidebar-border space-y-1">
        {/* Settings Link */}
        <NavLink
          to="/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
            collapsed && "justify-center px-2"
          )}
          activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
        >
          <Settings className="h-5 w-5 shrink-0" strokeWidth={2} />
          {!collapsed && <span className="text-sm">{t.nav.settings}</span>}
        </NavLink>

        {/* Collapse Button */}
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "w-full flex items-center justify-center text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground transition-colors h-10",
            collapsed ? "px-0" : "px-3"
          )}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : (
            <div className="flex items-center w-full">
              <ChevronLeft className="h-4 w-4 mr-2" />
              <span className="text-sm">{t.common.collapseSidebar}</span>
            </div>
          )}
        </Button>
      </div>
    </aside>
  );
};
