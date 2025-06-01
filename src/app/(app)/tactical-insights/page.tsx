"use client";

import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Download, Shield, Target, Network, ListTree, Zap, Footprints, BarChart3, Palette, GitCompareArrows } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useIsMobile } from '@/hooks/use-mobile';
import { DataPlaceholder } from '@/components/shared/data-placeholder';
import { useFilters } from '@/contexts/filter-context';

const insightCategories = [
  { id: "defensive-metrics", label: "Defensive Metrics", icon: Shield },
  { id: "offensive-metrics", label: "Offensive Metrics", icon: Target },
  { id: "pass-network", label: "Pass Network", icon: Network },
  { id: "build-up-analysis", label: "Build-Up Analysis", icon: ListTree },
  { id: "pressing-analysis", label: "Pressing Analysis", icon: Zap },
  { id: "transitions", label: "Transitions", icon: Footprints },
  { id: "set-pieces", label: "Set Pieces", icon: BarChart3 },
  { id: "formation-analysis", label: "Formation Analysis", icon: Palette }, // Palette as placeholder icon
  { id: "team-style", label: "Team Style", icon: Palette },
  { id: "style-comparison", label: "Style Comparison", icon: GitCompareArrows },
];

export default function TacticalInsightsPage() {
  const isMobile = useIsMobile();
  const { selectedTeam } = useFilters();

  const content = (
    <>
    {!selectedTeam ? (
         <DataPlaceholder state="empty" title="No Team Selected" message="Please select a team from the sidebar to view tactical insights." className="mt-6" />
      ) : (
        insightCategories.map(category => (
          <Card key={category.id} id={category.id} className="rounded-[1rem] shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <category.icon className="h-5 w-5 text-accent" />
                {category.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DataPlaceholder state="custom" message={`${category.label} visualization coming soon.`} className="min-h-[200px]" />
            </CardContent>
          </Card>
        ))
      )}
    </>
  );


  return (
    <>
      <PageHeader title="Tactical Insights">
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </PageHeader>

      {isMobile ? (
        <Accordion type="single" collapsible className="w-full space-y-4">
          {insightCategories.map(category => (
            <AccordionItem value={category.id} key={category.id} className="border rounded-[1rem] shadow-soft bg-card">
              <AccordionTrigger className="p-4 hover:no-underline">
                <div className="flex items-center gap-2 text-lg font-medium">
                  <category.icon className="h-5 w-5 text-accent" />
                  {category.label}
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-4 pt-0">
                {!selectedTeam ? (
                    <DataPlaceholder state="empty" title="No Team Selected" message="Please select a team to view this insight." />
                ) : (
                    <DataPlaceholder state="custom" message={`${category.label} visualization coming soon.`} className="min-h-[200px]" />
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <Tabs defaultValue={insightCategories[0].id} className="flex gap-6">
          <TabsList className="flex flex-col h-auto items-start bg-card p-2 rounded-[1rem] shadow-soft space-y-1 min-w-[200px]">
            {insightCategories.map(category => (
              <TabsTrigger key={category.id} value={category.id} className="w-full justify-start gap-2 data-[state=active]:bg-accent/20 data-[state=active]:text-accent data-[state=active]:shadow-none">
                <category.icon className="h-4 w-4" />
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="flex-1">
            {insightCategories.map(category => (
              <TabsContent key={category.id} value={category.id}>
                {!selectedTeam ? (
                    <DataPlaceholder state="empty" title="No Team Selected" message="Please select a team to view this insight." className="mt-0" />
                 ) : (
                    <Card className="rounded-[1rem] shadow-soft">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                           <category.icon className="h-6 w-6 text-accent" />
                           {category.label}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <DataPlaceholder state="custom" message={`${category.label} visualization coming soon.`} className="min-h-[300px]" />
                      </CardContent>
                    </Card>
                )}
              </TabsContent>
            ))}
          </div>
        </Tabs>
      )}
    </>
  );
}
