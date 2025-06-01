"use client";

import { NAV_LINKS, MOCK_COMPETITIONS, MOCK_SEASONS, MOCK_TEAMS, MOCK_MATCHES, MOCK_PLAYERS } from '@/lib/constants';
import { NavLink } from './nav-link';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Label } from '@/components/ui/label';
import { useFilters } from '@/contexts/filter-context';
import type { Competition, Season, Team, Match, Player } from '@/types';
import { BarChart2, Users, BarChartHorizontalBig, GitCompareArrows, Presentation, SearchCheck } from 'lucide-react';
import Image from 'next/image';

const navIconsMap: { [key: string]: LucideIcon } = {
  "/dashboard": BarChart2,
  "/player-analysis": Users,
  "/player-comparison": GitCompareArrows,
  "/tactical-insights": Presentation,
  "/matchup-analysis": SearchCheck,
};

export function SidebarContent() {
  const {
    selectedCompetition, setCompetition,
    selectedSeason, setSeason,
    selectedTeam, setTeam,
    selectedMatch, setMatch,
    selectedPlayer, setPlayer,
  } = useFilters();

  const competitions = MOCK_COMPETITIONS;
  const seasons = selectedCompetition ? (MOCK_SEASONS as any)[selectedCompetition.id] || [] : [];
  const teams = selectedSeason ? (MOCK_TEAMS as any)[selectedSeason.id] || [] : [];
  const matches = selectedTeam ? (MOCK_MATCHES as any)[selectedTeam.id] || [] : [];
  const players = selectedTeam ? (MOCK_PLAYERS as any)[selectedTeam.id] || [] : [];


  return (
    <div className="flex h-full flex-col">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          <div>
            <h3 className="mb-2 text-sm font-semibold text-sidebar-foreground/70 group-data-[collapsible=icon]:hidden">Global Filters</h3>
            <div className="space-y-3 group-data-[collapsible=icon]:space-y-2">
              {/* Competition Select */}
              <div>
                <Label htmlFor="competition-select" className="text-xs text-sidebar-foreground/70 group-data-[collapsible=icon]:hidden">Competition</Label>
                <Select
                  value={selectedCompetition?.id || ""}
                  onValueChange={(value) => {
                    const comp = competitions.find(c => c.id === value);
                    setCompetition(comp || null);
                  }}
                >
                  <SelectTrigger id="competition-select" className="w-full bg-sidebar-accent/10 border-sidebar-border text-sidebar-foreground group-data-[collapsible=icon]:hidden">
                    <SelectValue placeholder="Select Competition" />
                  </SelectTrigger>
                  <SelectContent className="group-data-[collapsible=icon]:hidden">
                    {competitions.map((comp) => (
                      <SelectItem key={comp.id} value={comp.id}>{comp.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Season Select */}
              {selectedCompetition && (
                <div>
                  <Label htmlFor="season-select" className="text-xs text-sidebar-foreground/70 group-data-[collapsible=icon]:hidden">Season</Label>
                  <Select
                    value={selectedSeason?.id || ""}
                    onValueChange={(value) => {
                      const season = seasons.find((s: Season) => s.id === value);
                      setSeason(season || null);
                    }}
                    disabled={!selectedCompetition}
                  >
                    <SelectTrigger id="season-select" className="w-full bg-sidebar-accent/10 border-sidebar-border text-sidebar-foreground group-data-[collapsible=icon]:hidden">
                      <SelectValue placeholder="Select Season" />
                    </SelectTrigger>
                    <SelectContent className="group-data-[collapsible=icon]:hidden">
                      {seasons.map((season: Season) => (
                        <SelectItem key={season.id} value={season.id}>{season.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Team Select */}
               {selectedSeason && (
                <div>
                  <Label htmlFor="team-select" className="text-xs text-sidebar-foreground/70 group-data-[collapsible=icon]:hidden">Team</Label>
                  <Select
                    value={selectedTeam?.id || ""}
                    onValueChange={(value) => {
                      const team = teams.find((t: Team) => t.id === value);
                      setTeam(team || null);
                    }}
                    disabled={!selectedSeason}
                  >
                    <SelectTrigger id="team-select" className="w-full bg-sidebar-accent/10 border-sidebar-border text-sidebar-foreground group-data-[collapsible=icon]:hidden">
                       <SelectValue placeholder="Select Team" />
                    </SelectTrigger>
                    <SelectContent className="group-data-[collapsible=icon]:hidden">
                      {teams.map((team: Team) => (
                        <SelectItem key={team.id} value={team.id}>
                          <div className="flex items-center gap-2">
                            {team.logoUrl && <Image src={team.logoUrl} alt={team.name} width={16} height={16} data-ai-hint="team logo" />}
                            {team.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {/* Match Select - for Dashboard and specific contexts */}
              {selectedTeam && (
                 <div>
                  <Label htmlFor="match-select" className="text-xs text-sidebar-foreground/70 group-data-[collapsible=icon]:hidden">Match</Label>
                  <Select
                    value={selectedMatch?.id || ""}
                    onValueChange={(value) => {
                      const match = matches.find((m: Match) => m.id === value);
                      setMatch(match || null);
                    }}
                    disabled={!selectedTeam}
                  >
                    <SelectTrigger id="match-select" className="w-full bg-sidebar-accent/10 border-sidebar-border text-sidebar-foreground group-data-[collapsible=icon]:hidden">
                      <SelectValue placeholder="Select Match" />
                    </SelectTrigger>
                    <SelectContent className="group-data-[collapsible=icon]:hidden">
                      {matches.map((match: Match) => (
                        <SelectItem key={match.id} value={match.id}>{match.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Player Select - for Player Analysis / Comparison */}
              {selectedTeam && (
                 <div>
                  <Label htmlFor="player-select" className="text-xs text-sidebar-foreground/70 group-data-[collapsible=icon]:hidden">Player</Label>
                  <Select
                    value={selectedPlayer?.id || ""}
                    onValueChange={(value) => {
                      const player = players.find((p: Player) => p.id === value);
                      setPlayer(player || null);
                    }}
                    disabled={!selectedTeam}
                  >
                    <SelectTrigger id="player-select" className="w-full bg-sidebar-accent/10 border-sidebar-border text-sidebar-foreground group-data-[collapsible=icon]:hidden">
                      <SelectValue placeholder="Select Player" />
                    </SelectTrigger>
                    <SelectContent className="group-data-[collapsible=icon]:hidden">
                      {players.map((player: Player) => (
                        <SelectItem key={player.id} value={player.id}>{player.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>
          
          <hr className="border-sidebar-border group-data-[collapsible=icon]:hidden" />

          <div>
            <h3 className="mb-2 text-sm font-semibold text-sidebar-foreground/70 group-data-[collapsible=icon]:hidden">Navigation</h3>
            <nav className="space-y-1">
              {NAV_LINKS.map((link) => (
                <NavLink 
                  key={link.href} 
                  href={link.href} 
                  icon={navIconsMap[link.href]} 
                  isSidebarButton={true}
                  tooltip={link.label}
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Example of sub-links within an accordion, as per prompt for Tactical Insights */}
          <div className="group-data-[collapsible=icon]:hidden">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="tactical-insights-sublinks" className="border-none">
                <AccordionTrigger className="py-2 px-2 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md hover:no-underline">
                  Tactical Insights Details
                </AccordionTrigger>
                <AccordionContent className="pl-4 pt-1 pb-0">
                  <nav className="space-y-1">
                    {['Defensive Metrics', 'Offensive Metrics', 'Pass Network'].map(subLink => (
                       <NavLink 
                          key={subLink} 
                          href={`/tactical-insights#${subLink.toLowerCase().replace(/\s+/g, '-')}`}
                          className="block py-1.5 px-2 text-xs text-sidebar-foreground/80 hover:text-sidebar-accent-foreground hover:bg-sidebar-accent/50 rounded-md"
                          activeClassName="text-sidebar-accent-foreground bg-sidebar-accent/50"
                        >
                         {subLink}
                       </NavLink>
                    ))}
                  </nav>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

        </div>
      </ScrollArea>
      {/* Sidebar Footer can go here if needed */}
    </div>
  );
}
