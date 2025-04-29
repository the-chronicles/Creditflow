
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { User, Home, CreditCard, FileText, Settings, LogOut, Wallet, Calendar } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar onLogout={logout} username={user?.name || 'User'} />
        <div className="flex-1 flex flex-col">
          <header className="h-14 border-b flex items-center px-4 sm:px-6 bg-background">
            <SidebarTrigger className="mr-2" />
            <h1 className="text-lg font-medium">CreditFlow</h1>
            <div className="ml-auto flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className="hidden md:flex gap-2 items-center"
                onClick={() => navigate('/profile')}
              >
                <User className="h-4 w-4" />
                <span>{user?.name}</span>
              </Button>
            </div>
          </header>
          <main className="flex-1 p-4 sm:p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

interface AppSidebarProps {
  onLogout: () => void;
  username: string;
}

function AppSidebar({ onLogout, username }: AppSidebarProps) {
  const navigate = useNavigate();

  const menuItems = [
    {
      title: "Dashboard",
      icon: Home,
      onClick: () => navigate('/dashboard')
    },
    {
      title: "My Loans",
      icon: CreditCard,
      onClick: () => navigate('/loans')
    },
    {
      title: "Apply for Loan",
      icon: FileText,
      onClick: () => navigate('/apply')
    },
    {
      title: "Payments",
      icon: Wallet,
      onClick: () => navigate('/payments')
    },
    {
      title: "Schedule",
      icon: Calendar,
      onClick: () => navigate('/schedule')
    },
    {
      title: "Settings",
      icon: Settings,
      onClick: () => navigate('/settings')
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="py-6">
        <div className="flex flex-col items-center gap-2 px-3">
          <h3 className="text-lg font-semibold tracking-tight">CreditFlow</h3>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild onClick={item.onClick}>
                    <div className="flex items-center gap-3 cursor-pointer">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="px-3">
          <Button 
            variant="ghost" 
            className="w-full flex items-center gap-3 mb-2 bg-sidebar-accent hover:bg-sidebar-primary text-sidebar-foreground" 
            onClick={onLogout}
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
          <div className="flex items-center gap-3 px-4 py-2">
            <User className="h-4 w-4" />
            <div className="text-sm font-medium">{username}</div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
