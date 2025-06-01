
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

const allMockPlayers: Player[] = Object.values(MOCK_PLAYERS_DATA).flat();

const fetchRadarData = async (player1Id: string | null, player2Id: string | null): Promise<RadarDataPoint[]> => {
  if (!player1Id || !player2Id) return [];
  const dataSource = process.env.NEXT_PUBLIC_DATA_SOURCE;

  if (dataSource === 'api') {
    try {
      const response = await fetch(`/api/python/player-comparison/radar?player1Id=${player1Id}&player2Id=${player2Id}`);
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
      const response = await fetch(`/api/python/player-comparison/bar-chart?player1Id=${player1Id}&player2Id=${player2Id}&metric=${metric}`);
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
    ].filter(m => metric === 'all' || m.metric.toLowerCase() === metric.toLowerCase());
  }
};


export default function PlayerComparisonPage() {
  const [playerA, setPlayerA] = useState<Player | null>(null);
  const [playerB, setPlayerB] = useState<Player | null>(null);
  
  const [radarData, setRadarData] = useState<RadarDataPoint[]>([]);
  const [barChartData, setBarChartData] = useState<BarChartDataPoint[]>([]);
  const [barChartMetric, setBarChartMetric] = useState<string>("Goals");

  const [loadingRadar, setLoadingRadar] = useState(false);
  const [loadingBar, setLoadingBar] = useState(false);
  const [apiError, setApiError] = useState(false);

  useEffect(() => {
    if (playerA && playerB) {
      setLoadingRadar(true);
      setLoadingBar(true); // bar chart loading also depends on player selection
      setApiError(false);

      const loadRadar = async () => {
        const data = await fetchRadarData(playerA.id, playerB.id);
        if (process.env.NEXT_PUBLIC_DATA_SOURCE === 'api' && data.length === 0 && playerA && playerB) { // Check if API returned empty when it shouldn't
             // setApiError(true); // Potentially, or handle specific errors in fetch
        }
        setRadarData(data);
        setLoadingRadar(false);
      };
      loadRadar();
      // Bar chart data loading is triggered by its own effect when barChartMetric changes or players change
    } else {
      setRadarData([]);
      setBarChartData([]); // Clear bar chart data if players are not selected
      setApiError(false);
    }
  }, [playerA, playerB]);

  useEffect(() => {
    if (playerA && playerB) {
        setLoadingBar(true);
        setApiError(false); // Reset API error for bar chart
        const loadBarData = async () => {
            const data = await fetchBarChartData(playerA.id, playerB.id, barChartMetric);
            if (process.env.NEXT_PUBLIC_DATA_SOURCE === 'api' && data.length === 0 && playerA && playerB) {
                // setApiError(true); // Potentially
            }
            setBarChartData(data);
            setLoadingBar(false);
        };
        loadBarData();
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
          <SelectPlayerInput label="Player A" selectedPlayer={playerA} onSelectPlayer={setPlayerA} />
          <SelectPlayerInput label="Player B" selectedPlayer={playerB} onSelectPlayer={setPlayerB} />
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
}

function SelectPlayerInput({ label, selectedPlayer, onSelectPlayer }: SelectPlayerInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-muted-foreground mb-1">{label}</label>
      <Select
        value={selectedPlayer?.id || ""}
        onValueChange={(playerId) => {
          const player = allMockPlayers.find(p => p.id === playerId) || null;
          onSelectPlayer(player);
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={`Select ${label}`} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Players</SelectLabel>
            {allMockPlayers.map(player => (
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
