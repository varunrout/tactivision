"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
  icon?: LucideIcon;
  isSidebarButton?: boolean;
  tooltip?: string;
}

export function NavLink({ 
  href, 
  children, 
  className, 
  activeClassName, 
  icon: Icon, 
  isSidebarButton = false,
  tooltip
}: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));

  const linkContent = (
    <>
      {Icon && <Icon className={cn("h-5 w-5 shrink-0", isActive ? "text-accent" : "text-sidebar-foreground group-hover:text-sidebar-accent-foreground")} />}
      <span className={cn(isSidebarButton ? "truncate group-data-[collapsible=icon]:hidden" : "")}>{children}</span>
    </>
  );

  if (isSidebarButton) {
    return (
      <Link
        href={href}
        className={cn(
          "flex items-center gap-3 rounded-md p-2 text-sm font-medium transition-colors",
          "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground",
          "group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0",
          className
        )}
        aria-current={isActive ? 'page' : undefined}
        title={tooltip}
      >
        {linkContent}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        "text-sm font-medium transition-colors hover:text-accent",
        isActive ? "text-accent" : "text-primary-foreground",
        className,
        isActive && activeClassName
      )}
      aria-current={isActive ? 'page' : undefined}
    >
      {children}
    </Link>
  );
}
