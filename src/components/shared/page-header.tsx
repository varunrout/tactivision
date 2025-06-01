"use client";

import React from 'react';
import { useFilters } from '@/contexts/filter-context';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  children?: React.ReactNode; // For actions like "Download CSV"
}

export function PageHeader({ title, children }: PageHeaderProps) {
  const { selectedCompetition, selectedSeason, selectedTeam, selectedMatch } = useFilters();

  const breadcrumbItems = [
    selectedCompetition?.name,
    selectedSeason?.name,
    selectedTeam?.name,
    selectedMatch?.name,
  ].filter(Boolean);

  return (
    <div className="mb-6">
      {breadcrumbItems.length > 0 && (
        <nav aria-label="breadcrumb" className="mb-2 text-sm text-muted-foreground">
          <ol className="flex items-center space-x-1">
            {breadcrumbItems.map((item, index) => (
              <React.Fragment key={index}>
                <li>
                  {/* In a real app, these could be links to adjust filters */}
                  <span className={cn(index === breadcrumbItems.length -1 ? "font-medium text-foreground" : "")}>{item}</span>
                </li>
                {index < breadcrumbItems.length - 1 && (
                  <li>
                    <ChevronRight className="h-4 w-4" />
                  </li>
                )}
              </React.Fragment>
            ))}
          </ol>
        </nav>
      )}
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-3xl font-semibold text-foreground">{title}</h1>
        {children && <div className="flex items-center gap-2">{children}</div>}
      </div>
    </div>
  );
}
