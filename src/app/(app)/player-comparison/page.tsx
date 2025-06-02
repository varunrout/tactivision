"use client";

import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Download, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useEffect } from 'react';
import type { Player, RadarDataPoint, BarChartDataPoint, PlayerRadarResponseAPI, PlayerBarChartResponseAPI, APIPlayer } from '@/types';
import { MOCK_PLAYERS as MOCK_PLAYERS_DATA } from '@/lib/constants';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, XAxis, YAxis, Tooltip, CartesianGrid, Bar, Legend } from 'recharts';
import { DataPlaceholder } from '@/components/shared/data-placeholder';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';

// This will be populated by API call if dataSource is 'api', or use MOCK_PLAYERS_DATA otherwise
let allPlayersForSelection: APIPlayer[] = Object.values(MOCK_PLAYERS_DATA).flat();


const fetchAllPlayersForSelection = async (): Promise<APIPlayer[]> => {
  const dataSource = process.env.NEXT_PUBLIC_DATA_SOURCE;
  if (dataSource === 'api') {
    try {
      // The CSV for core-selectors/players requires team_id.
      // A general "all players" endpoint is not specified.
      // For now, API mode will also use MOCK_PLAYERS_DATA for dropdowns.
      // This could be changed if a /core-selectors/all-players endpoint becomes available.
      console.warn("Player comparison page: Using mock players for selection in API mode as a general player endpoint isn't available.");
      return Object.values(MOCK_PLAYERS_DATA).flat();
    } catch (error) {
      console.error("Error fetching all players (API mode, fallback to mock):", error);
      return Object.values(MOCK_PLAYERS_DATA).flat();
    }
  }
  return Object.values(MOCK_PLAYERS_DATA).flat();
};


const fetchRadarData = async (player1Id: string | null, player2Id: string | null): Promise<RadarDataPoint[]> => {
  if (!player1Id || !player2Id) return [];
  const dataSource = process.env.NEXT_PUBLIC_DATA_SOURCE;

  if (dataSource === 'api') {
    try {
      const response = await fetch(`${baseUrl}/player-comparison/radar?player1=${player1Id}&player2=${player2Id}`);
      if (!response.ok) {
        console.error('API Error: Failed to fetch radar data', response.status, response.statusText);
        return [];
      }
      const apiData: PlayerRadarResponseAPI = await response.json();
      if (apiData.players.length < 2 || !apiData.metrics) return [];

      const playerAData = apiData.players.find(p => p.player_id.toString() === player1Id)?.metrics || {};
      const playerBData = apiData.players.find(p => p.player_id.toString() === player2Id)?.metrics || {};
      
      return apiData.metrics.map(metric => ({
        metric: metric.replace(/_per_90/g, '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), // Prettify metric name
        playerAValue: (playerAData[metric] || 0) * (apiData.normalized ? 100 : 1), // Adjust if normalized
        playerBValue: (playerBData[metric] || 0) * (apiData.normalized ? 100 : 1),
        fullMark: apiData.normalized ? 100 : undefined // Or derive from metric_ranges if available
      }));

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
      const response = await fetch(`${baseUrl}/player-comparison/bar-chart?player1=${player1Id}&player2=${player2Id}&metric=${metric}`);
      if (!response.ok) {
        console.error('API Error: Failed to fetch bar chart data', response.status, response.statusText);
        return [];
      }
      const apiData: PlayerBarChartResponseAPI = await response.json();
      if (apiData.players.length < 2) return [];
      
      const playerAValue = apiData.players.find(p => p.player_id.toString() === player1Id)?.value || 0;
      const playerBValue = apiData.players.find(p => p.player_id.toString() === player2Id)?.value || 0;

      return [{
        metric: apiData.metric,
        playerAValue: playerAValue,
        playerBValue: playerBValue,
      }];

    } catch (error) {
      console.error('Fetch Error: Could not fetch bar chart data from API', error);
      return [];
    }
  } else {
    // Mock data logic
    await new Promise(resolve => setTimeout(resolve, 1000));
    const metricKey = metric.toLowerCase();
    if (metricKey === 'goals') return [{ metric: 'Goals', playerAValue: Math.floor(Math.random() * 30), playerBValue: Math.floor(Math.random() * 30) }];
    if (metricKey === 'assists') return [{ metric: 'Assists', playerAValue: Math.floor(Math.random() * 20), playerBValue: Math.floor(Math.random() * 20) }];
    if (metricKey === 'xg') return [{ metric: 'xG', playerAValue: parseFloat((Math.random() * 15).toFixed(1)), playerBValue: parseFloat((Math.random() * 15).toFixed(1)) }];
    return [];
  }
};


export default function PlayerComparisonPage() {
  const [playerA, setPlayerA] = useState<APIPlayer | null>(null); // Use APIPlayer for selected players
  const [playerB, setPlayerB] = useState<APIPlayer | null>(null);
  
  const [radarData, setRadarData] = useState<RadarDataPoint[]>([]);
  const [barChartData, setBarChartData] = useState<BarChartDataPoint[]>([]);
  const [barChartMetric, setBarChartMetric] = useState<string>("goals"); // API uses lowercase for metrics

  const [loadingRadar, setLoadingRadar] = useState(false);
  const [loadingBar, setLoadingBar] = useState(false);
  const [apiError, setApiError] = useState(false); // General API error state
  const [selectablePlayers, setSelectablePlayers] = useState<APIPlayer[]>([]);

  useEffect(() => {
    const loadPlayers = async () => {
        const players = await fetchAllPlayersForSelection();
        allPlayersForSelection = players; 
        setSelectablePlayers(players);
    };
    loadPlayers();
  }, []);


  useEffect(() => {
    if (playerA && playerB) {
      setLoadingRadar(true);
      setApiError(false); 

      const loadRadar = async () => {
        const data = await fetchRadarData(playerA.player_id.toString(), playerB.player_id.toString());
        if (process.env.NEXT_PUBLIC_DATA_SOURCE === 'api' && data.length === 0 && playerA && playerB) {
            // Potentially set specific error or rely on DataPlaceholder's empty state
        }
        setRadarData(data);
        setLoadingRadar(false);
      };
      loadRadar();
    } else {
      setRadarData([]);
    }
  }, [playerA, playerB]);

  useEffect(() => {
    if (playerA && playerB) {
        setLoadingBar(true);
        setApiError(false); 
        const loadBarData = async () => {
            const data = await fetchBarChartData(playerA.player_id.toString(), playerB.player_id.toString(), barChartMetric);
             if (process.env.NEXT_PUBLIC_DATA_SOURCE === 'api' && data.length === 0 && playerA && playerB) {
                // Potentially set specific error or rely on DataPlaceholder's empty state
            }
            setBarChartData(data);
            setLoadingBar(false);
        };
        loadBarData();
    } else {
        setBarChartData([]); 
    }
  }, [playerA, playerB, barChartMetric])


  if (apiError && process.env.NEXT_PUBLIC_DATA_SOURCE === 'api' && playerA && playerB) { // Show error if players selected but data fails
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
                    <Radar name={playerA?.player_name || "Player A"} dataKey="playerAValue" stroke="hsl(var(--chart-1))" fill="hsl(var(--chart-1))" fillOpacity={0.6} />
                    <Radar name={playerB?.player_name || "Player B"} dataKey="playerBValue" stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2))" fillOpacity={0.6} />
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
                <SelectItem value="goals">Goals</SelectItem>
                <SelectItem value="assists">Assists</SelectItem>
                <SelectItem value="xg">xG</SelectItem>
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
                    <Bar dataKey="playerAValue" fill="hsl(var(--chart-1))" name={playerA?.player_name || "Player A"} />
                    <Bar dataKey="playerBValue" fill="hsl(var(--chart-2))" name={playerB?.player_name || "Player B"} />
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
  selectedPlayer: APIPlayer | null;
  onSelectPlayer: (player: APIPlayer | null) => void;
  players: APIPlayer[];
  otherSelectedPlayer?: APIPlayer | null;
}

function SelectPlayerInput({ label, selectedPlayer, onSelectPlayer, players, otherSelectedPlayer }: SelectPlayerInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-muted-foreground mb-1">{label}</label>
      <Select
        value={selectedPlayer?.player_id?.toString() || ""}
        onValueChange={(playerId) => {
          const player = players.find(p => p.player_id.toString() === playerId) || null;
          onSelectPlayer(player);
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={`Select ${label}`} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Players</SelectLabel>
            {players.filter(player => player.player_id !== otherSelectedPlayer?.player_id).map(player => (
              <SelectItem key={player.player_id} value={player.player_id.toString()}>
                {player.player_name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

