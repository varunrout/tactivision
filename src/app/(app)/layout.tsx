"use client"; // This layout itself is a client component because SidebarProvider uses client features

import AppHeader from '@/components/layout/header';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { SidebarContent } from '@/components/layout/sidebar-content';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen flex-col bg-background">
        <AppHeader />
        <div className="flex flex-1">
          <Sidebar side="left" variant="sidebar" collapsible="icon">
            <SidebarContent />
          </Sidebar>
          <SidebarInset> {/* This is the main content area */}
            <main className="flex-1 p-4 sm:p-6 lg:p-8">
              {children}
            </main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
