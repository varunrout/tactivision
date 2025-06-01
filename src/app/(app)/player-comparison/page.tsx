
"use client";

import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Download, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useEffect } from 'react';
import type { Player, RadarDataPoint, BarChartDataPoint } from '@/types';
import { MOCK_PLAYERS as MOCK_PLAYERS_DATA } from '@/lib/constants';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, XAxis, YAxis, Tooltip, CartesianGrid, Bar, Legend } from 'recharts';
import { DataPlaceholder } from '@/components/shared/data-placeholder';

// This will be populated by API call if dataSource is 'api', or use MOCK_PLAYERS_DATA otherwise
let allPlayersForSelection: Player[] = Object.values(MOCK_PLAYERS_DATA).flat();


const fetchAllPlayersForSelection = async (): Promise<Player[]> => {
  // In a real scenario, this might fetch all players from a specific competition/season
  // For now, we'll use a simplified approach: if API mode, maybe try to fetch all known players
  // or expect global filters to narrow this down.
  // The prompt GET /core-selectors/players?team_id={id} is for a specific team.
  // A general "all players" endpoint isn't specified for core selectors yet.
  // So, for now, API mode will also use the MOCK_PLAYERS_DATA for the dropdowns,
  // assuming player selection is independent of other global filters for this page or that
  // a more specific player list would be populated if global team filter was active and API was used.
  return Object.values(MOCK_PLAYERS_DATA).flat();
};


const fetchRadarData = async (player1Id: string | null, player2Id: string | null): Promise<RadarDataPoint[]> => {
  if (!player1Id || !player2Id) return [];
  const dataSource = process.env.NEXT_PUBLIC_DATA_SOURCE;

  if (dataSource === 'api') {
    try {
      const response = await fetch(`/player-comparison/radar?player1=${player1Id}&player2=${player2Id}`);
      if (!response.ok) {
        console.error('API Error: Failed to fetch radar data', response.status, response.statusText);
        return [];
      }
      const data: RadarDataPoint[] = await response.json();
      return data;
    } catch (error) {
      console.error('Fetch Error: Could not fetch radar data from API', error);
      return [];
    }
  } else {
    // Mock data logic
    await new Promise(resolve => setTimeout(resolve, 1000));
    return [
      { metric: 'Shooting', playerAValue: Math.random() * 100, playerBValue: Math.random() * 100, fullMark: 100 },
      { metric: 'Passing', playerAValue: Math.random() * 100, playerBValue: Math.random() * 100, fullMark: 100 },
      { metric: 'Dribbling', playerAValue: Math.random() * 100, playerBValue: Math.random() * 100, fullMark: 100 },
      { metric: 'Defending', playerAValue: Math.random() * 100, playerBValue: Math.random() * 100, fullMark: 100 },
      { metric: 'Pace', playerAValue: Math.random() * 100, playerBValue: Math.random() * 100, fullMark: 100 },
      { metric: 'Physicality', playerAValue: Math.random() * 100, playerBValue: Math.random() * 100, fullMark: 100 },
    ];
  }
};

const fetchBarChartData = async (player1Id: string | null, player2Id: string | null, metric: string): Promise<BarChartDataPoint[]> => {
  if (!player1Id || !player2Id) return [];
  const dataSource = process.env.NEXT_PUBLIC_DATA_SOURCE;

  if (dataSource === 'api') {
    try {
      const response = await fetch(`/player-comparison/bar-chart?player1=${player1Id}&player2=${player2Id}&metric=${metric}`);
      if (!response.ok) {
        console.error('API Error: Failed to fetch bar chart data', response.status, response.statusText);
        return [];
      }
      const data: BarChartDataPoint[] = await response.json();
      return data;
    } catch (error) {
      console.error('Fetch Error: Could not fetch bar chart data from API', error);
      return [];
    }
  } else {
    // Mock data logic
    await new Promise(resolve => setTimeout(resolve, 1000));
    return [
      { metric: 'Goals', playerAValue: Math.floor(Math.random() * 30), playerBValue: Math.floor(Math.random() * 30) },
      { metric: 'Assists', playerAValue: Math.floor(Math.random() * 20), playerBValue: Math.floor(Math.random() * 20) },
      { metric: 'xG', playerAValue: parseFloat((Math.random() * 15).toFixed(1)), playerBValue: parseFloat((Math.random() * 15).toFixed(1)) },
    ].filter(m => barChartDataMetricMapping(metric) === 'all' || m.metric.toLowerCase() === barChartDataMetricMapping(metric).toLowerCase());
  }
};

// Helper to map display metric to API metric if needed, or just return it
const barChartDataMetricMapping = (displayMetric: string) => {
  // For now, assume displayMetric is the same as API metric
  return displayMetric;
}


export default function PlayerComparisonPage() {
  const [playerA, setPlayerA] = useState<Player | null>(null);
  const [playerB, setPlayerB] = useState<Player | null>(null);
  
  const [radarData, setRadarData] = useState<RadarDataPoint[]>([]);
  const [barChartData, setBarChartData] = useState<BarChartDataPoint[]>([]);
  const [barChartMetric, setBarChartMetric] = useState<string>("Goals");

  const [loadingRadar, setLoadingRadar] = useState(false);
  const [loadingBar, setLoadingBar] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [selectablePlayers, setSelectablePlayers] = useState<Player[]>([]);

  useEffect(() => {
    // Fetch all players for dropdowns on mount
    const loadPlayers = async () => {
        const players = await fetchAllPlayersForSelection();
        allPlayersForSelection = players; // Update the global-like variable for SelectPlayerInput
        setSelectablePlayers(players);
    };
    loadPlayers();
  }, []);


  useEffect(() => {
    if (playerA && playerB) {
      setLoadingRadar(true);
      // bar chart loading also depends on player selection, will be triggered by its own effect
      setApiError(false);

      const loadRadar = async () => {
        const data = await fetchRadarData(playerA.id, playerB.id);
        if (process.env.NEXT_PUBLIC_DATA_SOURCE === 'api' && data.length === 0 && playerA && playerB) {
           // setApiError(true); // Potentially an error if API should return data
        }
        setRadarData(data);
        setLoadingRadar(false);
      };
      loadRadar();
    } else {
      setRadarData([]);
      // Bar chart data is cleared by its own effect if players are not selected
    }
  }, [playerA, playerB]);

  useEffect(() => {
    if (playerA && playerB) {
        setLoadingBar(true);
        setApiError(false); 
        const loadBarData = async () => {
            const apiMetric = barChartDataMetricMapping(barChartMetric);
            const data = await fetchBarChartData(playerA.id, playerB.id, apiMetric);
            if (process.env.NEXT_PUBLIC_DATA_SOURCE === 'api' && data.length === 0 && playerA && playerB) {
                // setApiError(true); // Potentially
            }
            setBarChartData(data);
            setLoadingBar(false);
        };
        loadBarData();
    } else {
        setBarChartData([]); // Clear bar chart data if players are not selected
    }
  }, [playerA, playerB, barChartMetric])


  if (apiError && process.env.NEXT_PUBLIC_DATA_SOURCE === 'api') {
    return (
      <>
        <PageHeader title="Player Comparison" />
        <DataPlaceholder state="error" title="API Error" message="Could not fetch player comparison data from the API." />
      </>
    );
  }

  return (
    <>
      <PageHeader title="Player Comparison">
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </PageHeader>

      <Card className="mb-6 rounded-[1rem] shadow-soft p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <SelectPlayerInput label="Player A" selectedPlayer={playerA} onSelectPlayer={setPlayerA} players={selectablePlayers} otherSelectedPlayer={playerB}/>
          <SelectPlayerInput label="Player B" selectedPlayer={playerB} onSelectPlayer={setPlayerB} players={selectablePlayers} otherSelectedPlayer={playerA}/>
        </div>
      </Card>
      
      {!playerA || !playerB ? (
        <DataPlaceholder state="custom" title="Select Players" message="Choose two players to start the comparison.">
          <Users className="h-16 w-16 text-muted-foreground mb-4" />
        </DataPlaceholder>
      ) : (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-[1rem] shadow-soft">
          <CardHeader><CardTitle className="text-lg">Attribute Radar</CardTitle></CardHeader>
          <CardContent>
            {loadingRadar ? <DataPlaceholder state="loading" className="h-[350px]" /> : radarData.length === 0 ? <DataPlaceholder state="empty" title="No Radar Data" message="Radar chart data is not available for the selected players." className="h-[350px]" /> : (
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" fontSize={12} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} fontSize={10}/>
                    <Tooltip />
                    <Legend />
                    <Radar name={playerA?.name || "Player A"} dataKey="playerAValue" stroke="hsl(var(--chart-1))" fill="hsl(var(--chart-1))" fillOpacity={0.6} />
                    <Radar name={playerB?.name || "Player B"} dataKey="playerBValue" stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2))" fillOpacity={0.6} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-[1rem] shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">Metric Breakdown</CardTitle>
            <Select value={barChartMetric} onValueChange={setBarChartMetric}>
              <SelectTrigger className="w-[180px] mt-2">
                <SelectValue placeholder="Select metric" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Goals">Goals</SelectItem>
                <SelectItem value="Assists">Assists</SelectItem>
                <SelectItem value="xG">xG</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
             {loadingBar ? <DataPlaceholder state="loading" className="h-[350px]" /> : barChartData.length === 0 ? <DataPlaceholder state="empty" title="No Bar Chart Data" message={`Data for ${barChartMetric} is not available.`} className="h-[350px]" /> : (
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="metric" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="playerAValue" fill="hsl(var(--chart-1))" name={playerA?.name || "Player A"} />
                    <Bar dataKey="playerBValue" fill="hsl(var(--chart-2))" name={playerB?.name || "Player B"} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="rounded-[1rem] shadow-soft lg:col-span-2">
          <CardHeader><CardTitle className="text-lg">Key Stats Scatter Plot</CardTitle></CardHeader>
          <CardContent><DataPlaceholder state="custom" message="Scatter plot visualization coming soon." className="h-[300px]" /></CardContent>
        </Card>
        <Card className="rounded-[1rem] shadow-soft lg:col-span-2">
          <CardHeader><CardTitle className="text-lg">Similarity Map</CardTitle></CardHeader>
          <CardContent><DataPlaceholder state="custom" message="Player similarity network coming soon." className="h-[300px]" /></CardContent>
        </Card>
      </div>
      )}
    </>
  );
}


interface SelectPlayerInputProps {
  label: string;
  selectedPlayer: Player | null;
  onSelectPlayer: (player: Player | null) => void;
  players: Player[];
  otherSelectedPlayer?: Player | null;
}

function SelectPlayerInput({ label, selectedPlayer, onSelectPlayer, players, otherSelectedPlayer }: SelectPlayerInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-muted-foreground mb-1">{label}</label>
      <Select
        value={selectedPlayer?.id || ""}
        onValueChange={(playerId) => {
          const player = players.find(p => p.id === playerId) || null;
          onSelectPlayer(player);
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={`Select ${label}`} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Players</SelectLabel>
            {players.filter(player => player.id !== otherSelectedPlayer?.id).map(player => (
              <SelectItem key={player.id} value={player.id}>
                {player.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
