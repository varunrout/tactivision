
"use client";

import { NAV_LINKS, MOCK_COMPETITIONS, MOCK_SEASONS, MOCK_TEAMS, MOCK_MATCHES, MOCK_PLAYERS } from '@/lib/constants';
import { NavLink } from './nav-link';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Label } from '@/components/ui/label';
import { useFilters } from '@/contexts/filter-context';
import type { Competition, Season, Team, Match, Player, CompetitionAPI, SeasonAPI, TeamAPI, APIMatch, APIPlayer } from '@/types';
import { BarChart2, Users, BarChartHorizontalBig, GitCompareArrows, Presentation, SearchCheck } from 'lucide-react';
import Image from 'next/image';
import React, { useState, useEffect, useCallback } from 'react';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';

const navIconsMap: { [key: string]: LucideIcon } = {
  "/dashboard": BarChart2,
  "/player-analysis": Users,
  "/player-comparison": GitCompareArrows,
  "/tactical-insights": Presentation,
  "/matchup-analysis": SearchCheck,
};

// Helper function to fetch data
async function fetchData<T>(endpoint: string, fallbackData: T): Promise<T> {
  const dataSource = process.env.NEXT_PUBLIC_DATA_SOURCE;
  if (dataSource === 'api') {
    try {
      const response = await fetch(endpoint); // Full endpoint including baseUrl is passed here
      if (!response.ok) {
        console.error(`API Error: Failed to fetch from ${endpoint}`, response.status, response.statusText);
        return Array.isArray(fallbackData) ? [] as unknown as T : fallbackData; 
      }
      return await response.json();
    } catch (error) {
      console.error(`Fetch Error: Could not fetch from ${endpoint}`, error);
      return Array.isArray(fallbackData) ? [] as unknown as T : fallbackData;
    }
  }
  return fallbackData; 
}


export function SidebarContent() {
  const {
    selectedCompetition, setCompetition,
    selectedSeason, setSeason,
    selectedTeam, setTeam,
    selectedMatch, setMatch,
    selectedPlayer, setPlayer,
  } = useFilters();

  const [competitions, setCompetitionsState] = useState<Competition[]>(MOCK_COMPETITIONS);
  const [seasons, setSeasonsState] = useState<Season[]>([]);
  const [teams, setTeamsState] = useState<Team[]>([]);
  const [matches, setMatchesState] = useState<Match[]>([]);
  const [players, setPlayersState] = useState<APIPlayer[]>([]);

  const [loadingCompetitions, setLoadingCompetitions] = useState(false);
  const [loadingSeasons, setLoadingSeasons] = useState(false);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [loadingPlayers, setLoadingPlayers] = useState(false);

  const dataSource = process.env.NEXT_PUBLIC_DATA_SOURCE;

  useEffect(() => {
    setLoadingCompetitions(true);
    if (dataSource === 'api') {
      fetchData<CompetitionAPI[]>(`${baseUrl}/core-selectors/competitions`, [])
        .then(apiData => {
          const mappedData: Competition[] = apiData.map(c => ({
            id: c.competition_id.toString(),
            name: c.competition_name,
          }));
          setCompetitionsState(mappedData);
        })
        .finally(() => setLoadingCompetitions(false));
    } else {
      setCompetitionsState(MOCK_COMPETITIONS);
      setLoadingCompetitions(false);
    }
  }, [dataSource]);

  useEffect(() => {
    if (selectedCompetition) {
      setLoadingSeasons(true);
      if (dataSource === 'api') {
        fetchData<SeasonAPI[]>(`${baseUrl}/core-selectors/seasons?competition_id=${selectedCompetition.id}`, [])
          .then(apiData => {
            const mappedData: Season[] = apiData.map(s => ({
              id: s.season_id.toString(),
              name: s.season_name,
            }));
            setSeasonsState(mappedData);
          })
          .finally(() => setLoadingSeasons(false));
      } else {
        setSeasonsState((MOCK_SEASONS as any)[selectedCompetition.id] || []);
        setLoadingSeasons(false);
      }
    } else {
      setSeasonsState([]);
    }
  }, [selectedCompetition, dataSource]);

  useEffect(() => {
    if (selectedCompetition && selectedSeason) {
      setLoadingTeams(true);
      if (dataSource === 'api') {
        fetchData<TeamAPI[]>(`${baseUrl}/core-selectors/teams?competition_id=${selectedCompetition.id}&season_id=${selectedSeason.id}`, [])
          .then(apiData => {
            const mappedData: Team[] = apiData.map(t => ({
              id: t.team_id.toString(),
              name: t.team_name,
              // logoUrl is not in TeamAPI from CSV, so it will be undefined here
            }));
            setTeamsState(mappedData);
          })
          .finally(() => setLoadingTeams(false));
      } else {
        setTeamsState((MOCK_TEAMS as any)[selectedSeason.id] || []);
        setLoadingTeams(false);
      }
    } else {
      setTeamsState([]);
    }
  }, [selectedCompetition, selectedSeason, dataSource]);

  useEffect(() => {
    if (selectedTeam && selectedCompetition && selectedSeason) {
       setLoadingMatches(true);
       if (dataSource === 'api') {
        fetchData<APIMatch[]>(`${baseUrl}/core-selectors/matches?team_id=${selectedTeam.id}&competition_id=${selectedCompetition.id}&season_id=${selectedSeason.id}`, [])
          .then(apiData => {
            const mappedData: Match[] = apiData.map(m => ({
              id: m.match_id.toString(),
              name: `${m.home_team_name || 'TBC'} vs ${m.away_team_name || 'TBC'} - ${m.match_date || 'Date Unknown'}`,
              date: m.match_date || '',
            }));
            setMatchesState(mappedData);
          })
          .finally(() => setLoadingMatches(false));
       } else {
         setMatchesState((MOCK_MATCHES as any)[selectedTeam.id] || []);
         setLoadingMatches(false);
       }
    } else {
      setMatchesState([]);
    }
  }, [selectedTeam, selectedCompetition, selectedSeason, dataSource]);

  useEffect(() => {
    if (selectedTeam) {
      setLoadingPlayers(true);
      if (dataSource === 'api') {
        fetchData<APIPlayer[]>(`${baseUrl}/core-selectors/players?team_id=${selectedTeam.id}`, [])
          .then(apiData => {
            setPlayersState(apiData);
          })
          .finally(() => setLoadingPlayers(false));
      } else {
        setPlayersState((MOCK_PLAYERS as any)[selectedTeam.id] || []);
        setLoadingPlayers(false);
      }
    } else {
      setPlayersState([]);
    }
  }, [selectedTeam, dataSource]);


  const handleCompetitionChange = (value: string) => {
    const comp = competitions.find(c => c.id === value); 
    setCompetition(comp || null);
    setSeason(null);
    setTeam(null);
    setMatch(null);
    setPlayer(null);
  };

  const handleSeasonChange = (value: string) => {
    const season = seasons.find(s => s.id === value);
    setSeason(season || null);
    setTeam(null);
    setMatch(null);
    setPlayer(null);
  };

  const handleTeamChange = (value: string) => {
    const team = teams.find(t => t.id === value);
    setTeam(team || null);
    setMatch(null);
    setPlayer(null);
  };
  
  const handleMatchChange = (value: string) => {
    const match = matches.find(m => m.id === value);
    setMatch(match || null);
  };

  const handlePlayerChange = (value: string) => {
    const player = players.find(p => p.player_id.toString() === value); 
    setPlayer(player || null); 
  };


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
                  onValueChange={handleCompetitionChange}
                  disabled={loadingCompetitions}
                >
                  <SelectTrigger id="competition-select" className="w-full bg-sidebar-accent/10 border-sidebar-border text-sidebar-foreground group-data-[collapsible=icon]:hidden">
                    <SelectValue placeholder={loadingCompetitions ? "Loading..." : "Select Competition"} />
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
                    onValueChange={handleSeasonChange}
                    disabled={!selectedCompetition || loadingSeasons || seasons.length === 0}
                  >
                    <SelectTrigger id="season-select" className="w-full bg-sidebar-accent/10 border-sidebar-border text-sidebar-foreground group-data-[collapsible=icon]:hidden">
                      <SelectValue placeholder={loadingSeasons ? "Loading..." : (seasons.length === 0 && !loadingSeasons ? "No seasons" : "Select Season")} />
                    </SelectTrigger>
                    <SelectContent className="group-data-[collapsible=icon]:hidden">
                      {seasons.map((season) => (
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
                    onValueChange={handleTeamChange}
                    disabled={!selectedSeason || loadingTeams || teams.length === 0}
                  >
                    <SelectTrigger id="team-select" className="w-full bg-sidebar-accent/10 border-sidebar-border text-sidebar-foreground group-data-[collapsible=icon]:hidden">
                       <SelectValue placeholder={loadingTeams ? "Loading..." : (teams.length === 0 && !loadingTeams ? "No teams" : "Select Team")} />
                    </SelectTrigger>
                    <SelectContent className="group-data-[collapsible=icon]:hidden">
                      {teams.map((team) => (
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
              
              {/* Match Select */}
              {selectedTeam && (
                 <div>
                  <Label htmlFor="match-select" className="text-xs text-sidebar-foreground/70 group-data-[collapsible=icon]:hidden">Match</Label>
                  <Select
                    value={selectedMatch?.id || ""}
                    onValueChange={handleMatchChange}
                    disabled={!selectedTeam || loadingMatches || matches.length === 0}
                  >
                    <SelectTrigger id="match-select" className="w-full bg-sidebar-accent/10 border-sidebar-border text-sidebar-foreground group-data-[collapsible=icon]:hidden">
                      <SelectValue placeholder={loadingMatches ? "Loading..." : (matches.length === 0 && !loadingMatches ? "No matches" : "Select Match")} />
                    </SelectTrigger>
                    <SelectContent className="group-data-[collapsible=icon]:hidden">
                      {matches.map((match) => (
                        <SelectItem key={match.id} value={match.id}>{match.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Player Select */}
              {selectedTeam && (
                 <div>
                  <Label htmlFor="player-select" className="text-xs text-sidebar-foreground/70 group-data-[collapsible=icon]:hidden">Player</Label>
                  <Select
                    value={selectedPlayer?.player_id?.toString() || ""}
                    onValueChange={handlePlayerChange}
                    disabled={!selectedTeam || loadingPlayers || players.length === 0}
                  >
                    <SelectTrigger id="player-select" className="w-full bg-sidebar-accent/10 border-sidebar-border text-sidebar-foreground group-data-[collapsible=icon]:hidden">
                      <SelectValue placeholder={loadingPlayers ? "Loading..." : (players.length === 0 && !loadingPlayers ? "No players" : "Select Player")} />
                    </SelectTrigger>
                    <SelectContent className="group-data-[collapsible=icon]:hidden">
                      {players.map((player) => (
                        <SelectItem key={player.player_id} value={player.player_id.toString()}>{player.player_name}</SelectItem>
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
    </div>
  );
}

