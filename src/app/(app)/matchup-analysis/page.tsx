"use client";

import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Download, Users, BarChartBig, Brain } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import type { Team, HeadToHeadStats, TeamStyleMetrics, MatchPrediction } from '@/types';
import { MOCK_TEAMS as MOCK_TEAMS_DATA } from '@/lib/constants';
import { useState, useEffect } from 'react';
import { DataPlaceholder } from '@/components/shared/data-placeholder';

// This will be populated by API call if dataSource is 'api', or use MOCK_TEAMS_DATA otherwise
let allTeamsForSelection: Team[] = Object.values(MOCK_TEAMS_DATA).flat();

const fetchAllTeamsForSelection = async (): Promise<Team[]> => {
  // Similar to player comparison, a general "all teams" endpoint isn't specified for core selectors.
  // API mode will also use MOCK_TEAMS_DATA for dropdowns for now.
  // In a real app, this might come from /core-selectors/teams without competition/season, or be tied to global filters.
  return Object.values(MOCK_TEAMS_DATA).flat();
};


const fetchHeadToHead = async (team1Id: string | null, team2Id: string | null): Promise<HeadToHeadStats | null> => {
  if (!team1Id || !team2Id) return null;
  const dataSource = process.env.NEXT_PUBLIC_DATA_SOURCE;

  if (dataSource === 'api') {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await fetch(`${baseUrl}/matchup-analysis/head-to-head?team1=${team1Id}&team2=${team2Id}`);
      if (!response.ok) {
        console.error('API Error: Failed to fetch H2H stats', response.status, response.statusText);
        return null;
      }
      const data: HeadToHeadStats = await response.json();
      return data;
    } catch (error) {
      console.error('Fetch Error: Could not fetch H2H stats from API', error);
      return null;
    }
  } else {
    // Mock data logic
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      teamAWins: Math.floor(Math.random() * 10),
      teamBWins: Math.floor(Math.random() * 10),
      draws: Math.floor(Math.random() * 5),
      teamAGoals: Math.floor(Math.random() * 30),
      teamBGoals: Math.floor(Math.random() * 30),
      lastMeetings: [
        { date: '2023-05-10', scoreline: '2-1', winner: 'teamA' },
        { date: '2022-11-01', scoreline: '1-1', winner: 'draw' },
      ]
    };
  }
};

const fetchTeamStyles = async (team1Id: string | null, team2Id: string | null): Promise<{teamAStyle: TeamStyleMetrics, teamBStyle: TeamStyleMetrics} | null> => {
  if (!team1Id || !team2Id) return null;
  const dataSource = process.env.NEXT_PUBLIC_DATA_SOURCE;

  if (dataSource === 'api') {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await fetch(`${baseUrl}/matchup-analysis/team-style?team1=${team1Id}&team2=${team2Id}`);
      if (!response.ok) {
        console.error('API Error: Failed to fetch team styles', response.status, response.statusText);
        return null;
      }
      const data: {teamAStyle: TeamStyleMetrics, teamBStyle: TeamStyleMetrics} = await response.json();
      return data;
    } catch (error) {
      console.error('Fetch Error: Could not fetch team styles from API', error);
      return null;
    }
  } else {
    // Mock data logic
    await new Promise(resolve => setTimeout(resolve, 1000));
    const generateStyle = (): TeamStyleMetrics => ({
      possession: Math.floor(Math.random() * 70) + 30,
      directness: Math.floor(Math.random() * 100),
      pressIntensity: Math.floor(Math.random() * 100),
      buildupSpeed: Math.floor(Math.random() * 100),
    });
    return { teamAStyle: generateStyle(), teamBStyle: generateStyle() };
  }
};

const fetchMatchPrediction = async (team1Id: string | null, team2Id: string | null): Promise<MatchPrediction | null> => {
  if (!team1Id || !team2Id) return null;
  const dataSource = process.env.NEXT_PUBLIC_DATA_SOURCE;

  if (dataSource === 'api') {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await fetch(`${baseUrl}/matchup-analysis/matchup-prediction?team1=${team1Id}&team2=${team2Id}`);
      if (!response.ok) {
        console.error('API Error: Failed to fetch match prediction', response.status, response.statusText);
        return null;
      }
      const data: MatchPrediction = await response.json();
      return data;
    } catch (error) {
      console.error('Fetch Error: Could not fetch match prediction from API', error);
      return null;
    }
  } else {
    // Mock data logic
    await new Promise(resolve => setTimeout(resolve, 1000));
    const homeWin = Math.random();
    const draw = Math.random() * (1 - homeWin);
    const awayWin = 1 - homeWin - draw;
    return {
      homeWinProbability: parseFloat(homeWin.toFixed(2)),
      drawProbability: parseFloat(draw.toFixed(2)),
      awayWinProbability: parseFloat(awayWin.toFixed(2)),
      keyDrivers: ["Team A has strong home record (mock)", "Team B missing key striker (mock)"]
    };
  }
};

export default function MatchupAnalysisPage() {
  const [teamA, setTeamA] = useState<Team | null>(null);
  const [teamB, setTeamB] = useState<Team | null>(null);

  const [h2hStats, setH2hStats] = useState<HeadToHeadStats | null>(null);
  const [teamStyles, setTeamStyles] = useState<{teamAStyle: TeamStyleMetrics, teamBStyle: TeamStyleMetrics} | null>(null);
  const [prediction, setPrediction] = useState<MatchPrediction | null>(null);

  const [loadingH2h, setLoadingH2h] = useState(false);
  const [loadingStyles, setLoadingStyles] = useState(false);
  const [loadingPrediction, setLoadingPrediction] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [selectableTeams, setSelectableTeams] = useState<Team[]>([]);
  
  useEffect(() => {
    // Fetch all teams for dropdowns on mount
    const loadTeams = async () => {
        const teams = await fetchAllTeamsForSelection();
        allTeamsForSelection = teams; // Update the global-like variable
        setSelectableTeams(teams);
    };
    loadTeams();
  }, []);


  useEffect(() => {
    if (teamA && teamB) {
      setLoadingH2h(true);
      setLoadingStyles(true);
      setLoadingPrediction(true);
      setApiError(false);

      const loadData = async () => {
        const h2hData = await fetchHeadToHead(teamA.id, teamB.id);
        const stylesData = await fetchTeamStyles(teamA.id, teamB.id);
        const predictionData = await fetchMatchPrediction(teamA.id, teamB.id);

        if (process.env.NEXT_PUBLIC_DATA_SOURCE === 'api' && (!h2hData || !stylesData || !predictionData)) {
          setApiError(true);
        }
        
        setH2hStats(h2hData);
        setTeamStyles(stylesData);
        setPrediction(predictionData);

        setLoadingH2h(false);
        setLoadingStyles(false);
        setLoadingPrediction(false);
      };
      loadData();

    } else {
      setH2hStats(null);
      setTeamStyles(null);
      setPrediction(null);
      setApiError(false);
    }
  }, [teamA, teamB]);

  const isLoading = loadingH2h || loadingStyles || loadingPrediction;

  if (apiError && process.env.NEXT_PUBLIC_DATA_SOURCE === 'api' && (!teamA || !teamB) && !isLoading) { // Only show general API error if selections are made but data fails
    return (
      <>
        <PageHeader title="Matchup Analysis" />
        <DataPlaceholder state="error" title="API Error" message="Could not fetch matchup data from the API." />
      </>
    );
  }

  return (
    <>
      <PageHeader title="Matchup Analysis">
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </PageHeader>

       <Card className="mb-6 rounded-[1rem] shadow-soft p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <SelectTeamInput label="Team A" selectedTeam={teamA} onSelectTeam={setTeamA} teams={selectableTeams} otherSelectedTeam={teamB} />
          <SelectTeamInput label="Team B" selectedTeam={teamB} onSelectTeam={setTeamB} teams={selectableTeams} otherSelectedTeam={teamA}/>
        </div>
      </Card>

      {!teamA || !teamB ? (
        <DataPlaceholder state="custom" title="Select Teams" message="Choose two teams to start the matchup analysis.">
          <Users className="h-16 w-16 text-muted-foreground mb-4" />
        </DataPlaceholder>
      ) : (
        <div className="space-y-6">
          <Card className="rounded-[1rem] shadow-soft">
            <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Users className="text-accent h-5 w-5" /> Head-to-Head</CardTitle></CardHeader>
            <CardContent>
              {loadingH2h || !h2hStats ? <DataPlaceholder state="loading" className="min-h-[150px]" /> : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                  <div><p className="text-2xl font-bold">{h2hStats.teamAWins}</p><p className="text-xs text-muted-foreground">{teamA.name} Wins</p></div>
                  <div><p className="text-2xl font-bold">{h2hStats.draws}</p><p className="text-xs text-muted-foreground">Draws</p></div>
                  <div><p className="text-2xl font-bold">{h2hStats.teamBWins}</p><p className="text-xs text-muted-foreground">{teamB.name} Wins</p></div>
                  <div className="hidden md:block"><p className="text-2xl font-bold">{h2hStats.teamAGoals}</p><p className="text-xs text-muted-foreground">{teamA.name} Goals</p></div>
                   <div className="hidden md:block col-span-2 md:col-span-1"><p className="text-2xl font-bold">{h2hStats.teamBGoals}</p><p className="text-xs text-muted-foreground">{teamB.name} Goals</p></div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-[1rem] shadow-soft">
            <CardHeader><CardTitle className="text-lg flex items-center gap-2"><BarChartBig className="text-accent h-5 w-5" /> Team Styles</CardTitle></CardHeader>
            <CardContent>
              {loadingStyles || !teamStyles ? <DataPlaceholder state="loading" className="min-h-[200px]" /> : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TeamStyleDisplay teamName={teamA.name} style={teamStyles.teamAStyle} />
                  <TeamStyleDisplay teamName={teamB.name} style={teamStyles.teamBStyle} />
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="rounded-[1rem] shadow-soft">
            <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Brain className="text-accent h-5 w-5" /> Match Prediction</CardTitle></CardHeader>
            <CardContent>
              {loadingPrediction || !prediction ? <DataPlaceholder state="loading" className="min-h-[150px]" /> : (
                <div>
                  <div className="flex space-x-1 rounded-full overflow-hidden mb-2 h-8 border">
                    <div style={{ width: `${prediction.homeWinProbability * 100}%`}} className="bg-green-500 flex items-center justify-center text-white text-xs font-medium" title={`${teamA.name} Win: ${prediction.homeWinProbability*100}%`}>
                       {(prediction.homeWinProbability * 100).toFixed(0)}%
                    </div>
                    <div style={{ width: `${prediction.drawProbability * 100}%`}} className="bg-yellow-500 flex items-center justify-center text-neutral-800 text-xs font-medium" title={`Draw: ${prediction.drawProbability*100}%`}>
                       {(prediction.drawProbability * 100).toFixed(0)}%
                    </div>
                    <div style={{ width: `${prediction.awayWinProbability * 100}%`}} className="bg-red-500 flex items-center justify-center text-white text-xs font-medium" title={`${teamB.name} Win: ${prediction.awayWinProbability*100}%`}>
                       {(prediction.awayWinProbability * 100).toFixed(0)}%
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{teamA.name} Win</span>
                    <span>Draw</span>
                    <span>{teamB.name} Win</span>
                  </div>
                  {prediction.keyDrivers && prediction.keyDrivers.length > 0 && (
                    <div className="mt-4 p-3 bg-muted/50 rounded-md">
                      <h4 className="text-sm font-semibold mb-1">Key Drivers:</h4>
                      <ul className="list-disc list-inside text-xs text-muted-foreground space-y-0.5">
                        {prediction.keyDrivers.map((driver, i) => <li key={i}>{driver}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
          <p className="text-xs text-muted-foreground text-center mt-4">Last updated: {new Date().toLocaleDateString()}. All predictions are model-based and for informational purposes only.</p>
        </div>
      )}
    </>
  );
}

interface SelectTeamInputProps {
  label: string;
  selectedTeam: Team | null;
  onSelectTeam: (team: Team | null) => void;
  teams: Team[];
  otherSelectedTeam?: Team | null;
}

function SelectTeamInput({ label, selectedTeam, onSelectTeam, teams, otherSelectedTeam }: SelectTeamInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-muted-foreground mb-1">{label}</label>
      <Select
        value={selectedTeam?.id || ""}
        onValueChange={(teamId) => {
          const team = teams.find(t => t.id === teamId) || null;
          onSelectTeam(team);
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={`Select ${label}`} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Teams</SelectLabel>
            {teams.filter(team => team.id !== otherSelectedTeam?.id).map(team => (
              <SelectItem key={team.id} value={team.id}>
                {team.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

function TeamStyleDisplay({ teamName, style }: { teamName: string, style: TeamStyleMetrics }) {
  return (
    <div>
      <h3 className="text-md font-semibold mb-3 text-center">{teamName} Style</h3>
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-xs mb-1"><span>Possession</span><span>{style.possession}%</span></div>
          <Progress value={style.possession} className="h-2" />
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1"><span>Directness</span><span>{style.directness}</span></div>
          <Progress value={style.directness} className="h-2" />
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1"><span>Press Intensity</span><span>{style.pressIntensity}</span></div>
          <Progress value={style.pressIntensity} className="h-2" />
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1"><span>Buildup Speed</span><span>{style.buildupSpeed}</span></div>
          <Progress value={style.buildupSpeed} className="h-2" />
        </div>
      </div>
    </div>
  );
}
