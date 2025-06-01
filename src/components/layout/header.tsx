
"use client";

import Link from 'next/link';
import { Search, User, Menu } from 'lucide-react';
import Logo from '@/components/icons/logo';
import { NAV_LINKS } from '@/lib/constants';
import { NavLink } from './nav-link';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar'; // Assuming this hook exists from shadcn sidebar
import { cn } from '@/lib/utils';

export default function AppHeader() {
  const { toggleSidebar, isMobile } = useSidebar();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="text-primary-foreground hover:bg-primary/80 hover:text-accent">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          )}
          <Link href="/dashboard" className="flex items-center group">
            <Logo />
          </Link>
          <nav className="hidden items-center space-x-4 md:flex">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.href} href={link.href} className="text-foreground hover:text-accent" activeClassName="text-accent font-semibold">
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="text-foreground hover:text-accent">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
          <Button variant="ghost" size="icon" className="text-foreground hover:text-accent">
            <User className="h-5 w-5" />
            <span className="sr-only">User Profile</span>
          </Button>
          {/* Optional: Dark mode toggle */}
        </div>
      </div>
    </header>
  );
}
