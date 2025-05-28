import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/hooks/use-language";
import { Link } from "wouter";

interface DashboardLayoutProps {
  children: React.ReactNode;
  location: string;
}

export function DashboardLayout({ children, location }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { t } = useLanguage();
  
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex">
      <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} location={location} />
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-[80px]' : 'ml-[250px]'}`}>
        <header className="h-16 px-4 border-b flex items-center justify-between bg-white shadow-sm">
          <h1 className="text-xl font-semibold text-zinc-800">{t('admin.dashboard.title', 'Admin Dashboard')}</h1>
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            <Link href="/">
              <Button variant="outline" size="sm" className="gap-2">
                <ExternalLink size={18} />
                <span>{t('admin.viewSite', 'View Site')}</span>
              </Button>
            </Link>
          </div>
        </header>
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}