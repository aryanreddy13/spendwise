import { useNavigate, Outlet } from 'react-router-dom';
import { Bell, User, Settings as SettingsIcon, LogOut } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AppSidebar } from './AppSidebar';
import { Footer } from './Footer';
import { Chatbot } from '@/components/Chatbot';
import { LanguageSelector } from '@/components/LanguageSelector';
import { useUser } from '@/contexts/UserContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useTranslation } from '@/hooks/useTranslation';
import { Onboarding } from '@/components/Onboarding';

export const AppLayout = () => {
  const { name, logout, isAuthenticated } = useUser();
  const { t } = useTranslation();
  const navigate = useNavigate();

  // If authenticated but name is missing, show onboarding
  const showOnboarding = isAuthenticated && !name;

  return (
    <div className="min-h-screen flex w-full relative">
      {showOnboarding && <Onboarding />}
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b bg-card px-6 flex items-center justify-end sticky top-0 z-10 gap-4">

          <div className="flex items-center gap-3">
            <LanguageSelector />
            {/* <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-primary">
              <Bell className="h-5 w-5" />
            </Button> */}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold cursor-pointer hover:bg-primary/20 transition-colors select-none">
                  {name ? name.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>{t.common.myAccount}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>{t.common.profile}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  <SettingsIcon className="mr-2 h-4 w-4" />
                  <span>{t.common.settings}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => {
                  logout();
                  navigate('/');
                }} className="text-red-600 focus:text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t.common.logout}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
        <Footer />
        <Chatbot />
      </div>
    </div>
  );
};
