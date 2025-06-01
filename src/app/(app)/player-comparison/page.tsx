"use client";

import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Download, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useEffect } from 'react';
import type { Player, RadarDataPoint, BarChartDataPoint, ScatterPlotDataPoint, SimilarityMapData } from '@/types';
import { MOCK_PLAYERS, MOCK_TEAMS } from '@/lib/constants';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, XAxis, YAxis, Tooltip, CartesianGrid, Bar, Legend, ScatterChart, Scatter } from 'recharts';
import { DataPlaceholder } from '@/components/shared/data-placeholder';

const allMockPlayers: Player[] = Object.values(MOCK_PLAYERS).flat();

// Mock API functions
const fetchRadarData = async (player1Id: string | null, player2Id: string | null): Promise<RadarDataPoint[]> => {
  if (!player1Id || !player2Id) return [];
  await new Promise(resolve => setTimeout(resolve, 1000));
  return [
    { metric: 'Shooting', playerAValue: Math.random() * 100, playerBValue: Math.random() * 100, fullMark: 100 },
    { metric: 'Passing', playerAValue: Math.random() * 100, playerBValue: Math.random() * 100, fullMark: 100 },
    { metric: 'Dribbling', playerAValue: Math.random() * 100, playerBValue: Math.random() * 100, fullMark: 100 },
    { metric: 'Defending', playerAValue: Math.random() * 100, playerBValue: Math.random() * 100, fullMark: 100 },
    { metric: 'Pace', playerAValue: Math.random() * 100, playerBValue: Math.random() * 100, fullMark: 100 },
    { metric: 'Physicality', playerAValue: Math.random() * 100, playerBValue: Math.random() * 100, fullMark: 100 },
  ];
};

const fetchBarChartData = async (player1Id: string | null, player2Id: string | null, metric: string): Promise<BarChartDataPoint[]> => {
  if (!player1Id || !player2Id) return [];
  await new Promise(resolve => setTimeout(resolve, 1000));
  return [
    { metric: 'Goals', playerAValue: Math.floor(Math.random() * 30), playerBValue: Math.floor(Math.random() * 30) },
    { metric: 'Assists', playerAValue: Math.floor(Math.random() * 20), playerBValue: Math.floor(Math.random() * 20) },
    { metric: 'xG', playerAValue: parseFloat((Math.random() * 15).toFixed(1)), playerBValue: parseFloat((Math.random() * 15).toFixed(1)) },
  ].filter(m => metric === 'all' || m.metric.toLowerCase() === metric.toLowerCase());
};


export default function PlayerComparisonPage() {
  const [playerA, setPlayerA] = useState<Player | null>(null);
  const [playerB, setPlayerB] = useState<Player | null>(null);
  
  const [radarData, setRadarData] = useState<RadarDataPoint[]>([]);
  const [barChartData, setBarChartData] = useState<BarChartDataPoint[]>([]);
  const [barChartMetric, setBarChartMetric] = useState<string>("Goals");

  const [loadingRadar, setLoadingRadar] = useState(false);
  const [loadingBar, setLoadingBar] = useState(false);

  useEffect(() => {
    if (playerA && playerB) {
      setLoadingRadar(true);
      setLoadingBar(true);
      fetchRadarData(playerA.id, playerB.id).then(data => {
        setRadarData(data);
        setLoadingRadar(false);
      });
      fetchBarChartData(playerA.id, playerB.id, barChartMetric).then(data => {
        setBarChartData(data);
        setLoadingBar(false);
      });
    } else {
      setRadarData([]);
      setBarChartData([]);
    }
  }, [playerA, playerB, barChartMetric]);

  const handleCompare = () => {
     // Triggered by button, effect already handles fetching if players are set
     // This is more for if there was an explicit button, currently selections trigger fetch
  }

  return (
    <>
      <PageHeader title="Player Comparison">
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </PageHeader>

      {/* Selection Panel */}
      <Card className="mb-6 rounded-[1rem] shadow-soft p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <SelectPlayerInput label="Player A" selectedPlayer={playerA} onSelectPlayer={setPlayerA} />
          <SelectPlayerInput label="Player B" selectedPlayer={playerB} onSelectPlayer={setPlayerB} />
        </div>
         {/* <Button onClick={handleCompare} disabled={!playerA || !playerB} className="mt-4 w-full md:w-auto">
            Compare Players
          </Button> */}
      </Card>
      
      {!playerA || !playerB ? (
        <DataPlaceholder state="custom" title="Select Players" message="Choose two players to start the comparison.">
          <Users className="h-16 w-16 text-muted-foreground mb-4" />
        </DataPlaceholder>
      ) : (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart Comparison */}
        <Card className="rounded-[1rem] shadow-soft">
          <CardHeader><CardTitle className="text-lg">Attribute Radar</CardTitle></CardHeader>
          <CardContent>
            {loadingRadar ? <DataPlaceholder state="loading" className="h-[350px]" /> : radarData.length === 0 ? <DataPlaceholder state="empty" className="h-[350px]" /> : (
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

        {/* Bar Chart Metric Breakdown */}
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
             {loadingBar ? <DataPlaceholder state="loading" className="h-[350px]" /> : barChartData.length === 0 ? <DataPlaceholder state="empty" className="h-[350px]" /> : (
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
        {/* Scatter Plot - Placeholder */}
        <Card className="rounded-[1rem] shadow-soft lg:col-span-2">
          <CardHeader><CardTitle className="text-lg">Key Stats Scatter Plot</CardTitle></CardHeader>
          <CardContent><DataPlaceholder state="custom" message="Scatter plot visualization coming soon." className="h-[300px]" /></CardContent>
        </Card>
        {/* Similarity Map - Placeholder */}
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

