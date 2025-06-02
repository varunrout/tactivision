"use client";

import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFilters } from '@/contexts/filter-context';
import Image from 'next/image';
import type { PlayerProfile, PerformanceTrendData, PlayerEvent } from '@/types';
import { useState, useEffect } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import SoccerPitchSVG from '@/components/icons/soccer-pitch-svg';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataPlaceholder } from '@/components/shared/data-placeholder';
import { MOCK_PLAYERS as MOCK_PLAYERS_DATA } from '@/lib/constants'; 

const fetchPlayerProfile = async (playerId: string | null): Promise<PlayerProfile | null> => {
  if (!playerId) return null;
  const dataSource = process.env.NEXT_PUBLIC_DATA_SOURCE;

  if (dataSource === 'api') {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await fetch(`${baseUrl}/player-analysis/profile?player_id=${playerId}`);
      if (!response.ok) {
        console.error('API Error: Failed to fetch player profile', response.status, response.statusText);
        return null;
      }
      const data: PlayerProfile = await response.json();
      return data;
    } catch (error) {
      console.error('Fetch Error: Could not fetch player profile from API', error);
      return null;
    }
  } else {
    // Mock data logic
    await new Promise(resolve => setTimeout(resolve, 1000));
    let player: PlayerProfile | undefined;
    for (const teamId in MOCK_PLAYERS_DATA) {
      const teamPlayers = (MOCK_PLAYERS_DATA as any)[teamId] as PlayerProfile[];
      player = teamPlayers.find(p => p.id === playerId);
      if (player) break;
    }
    if (!player) return null;
    return {
      ...player,
      id: playerId,
      name: player.name || 'Selected Player',
      position: player.position || 'Forward',
      age: player.age || 23,
      nationality: player.nationality || 'Norwegian',
      teamBadgeUrl: player.teamBadgeUrl || 'https://placehold.co/40x40.png?text=TB',
      photoUrl: player.photoUrl || 'https://placehold.co/120x120.png?text=P',
      appearances: player.appearances || 35,
      goals: player.goals || 28,
      assists: player.assists || 12,
      minutesPlayed: player.minutesPlayed || 3000,
    };
  }
};

const fetchPerformanceTrend = async (playerId: string | null, metric: string): Promise<PerformanceTrendData | null> => {
  if (!playerId) return null;
  const dataSource = process.env.NEXT_PUBLIC_DATA_SOURCE;

  if (dataSource === 'api') {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await fetch(`${baseUrl}/player-analysis/performance-trend?player_id=${playerId}&metric=${metric}`);
      if (!response.ok) {
        console.error('API Error: Failed to fetch performance trend', response.status, response.statusText);
        return null;
      }
      const data: PerformanceTrendData = await response.json();
      return data;
    } catch (error) {
      console.error('Fetch Error: Could not fetch performance trend from API', error);
      return null;
    }
  } else {
    // Mock data logic
    await new Promise(resolve => setTimeout(resolve, 1200));
    const baseValue = metric === 'xG' ? 0.5 : metric === 'passes' ? 50 : 10;
    return {
      metricName: metric,
      data: Array.from({ length: 10 }, (_, i) => ({
        date: `Match ${i + 1}`,
        value: parseFloat((baseValue + Math.random() * (baseValue / 2) - (baseValue / 4)).toFixed(2)),
      })),
    };
  }
};

const fetchPlayerEventMap = async (playerId: string | null): Promise<PlayerEvent[]> => {
  if (!playerId) return [];
  const dataSource = process.env.NEXT_PUBLIC_DATA_SOURCE;

  if (dataSource === 'api') {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await fetch(`${baseUrl}/player-analysis/event-map?player_id=${playerId}`);
      if (!response.ok) {
        console.error('API Error: Failed to fetch player event map', response.status, response.statusText);
        return [];
      }
      const data: PlayerEvent[] = await response.json();
      return data;
    } catch (error) {
      console.error('Fetch Error: Could not fetch player event map from API', error);
      return [];
    }
  } else {
    // Mock data logic
    await new Promise(resolve => setTimeout(resolve, 1500));
    return Array.from({ length: 20 }, (_, i) => ({
      id: `e${i}`,
      type: ['pass', 'shot', 'tackle'][i % 3] as 'pass' | 'shot' | 'tackle',
      x: Math.random() * 100,
      y: Math.random() * 100,
      outcome: Math.random() > 0.5 ? 'success' : 'fail',
      minute: Math.floor(Math.random() * 90) + 1,
    }));
  }
};

export default function PlayerAnalysisPage() {
  const { selectedPlayer } = useFilters();
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [performanceData, setPerformanceData] = useState<PerformanceTrendData | null>(null);
  const [eventMapData, setEventMapData] = useState<PlayerEvent[]>([]);
  const [currentMetric, setCurrentMetric] = useState('xG');
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingTrend, setLoadingTrend] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [apiError, setApiError] = useState(false);

  useEffect(() => {
    if (selectedPlayer) {
      setLoadingProfile(true);
      setLoadingTrend(true); 
      setLoadingEvents(true);
      setApiError(false);

      const loadProfile = async () => {
        const data = await fetchPlayerProfile(selectedPlayer.id);
        if (process.env.NEXT_PUBLIC_DATA_SOURCE === 'api' && !data) setApiError(true);
        setProfile(data);
        setLoadingProfile(false);
      };
      loadProfile();

      const loadEvents = async () => {
        const data = await fetchPlayerEventMap(selectedPlayer.id);
         if (process.env.NEXT_PUBLIC_DATA_SOURCE === 'api' && !data) setApiError(true); 
        setEventMapData(data || []);
        setLoadingEvents(false);
      };
      loadEvents();
      
    } else {
      setProfile(null);
      setPerformanceData(null);
      setEventMapData([]);
      setLoadingProfile(false);
      setLoadingTrend(false);
      setLoadingEvents(false);
      setApiError(false);
    }
  }, [selectedPlayer]);
  
  useEffect(() => {
    if (selectedPlayer) {
      setLoadingTrend(true);
      setApiError(false); 
      const loadTrend = async () => {
        const data = await fetchPerformanceTrend(selectedPlayer.id, currentMetric);
        if (process.env.NEXT_PUBLIC_DATA_SOURCE === 'api' && !data) {
          // If profile also failed, apiError would be true. 
          // If only trend fails, we might want a more specific error indicator.
          // For now, a missing trend data will show the empty placeholder.
        }
        setPerformanceData(data);
        setLoadingTrend(false);
      };
      loadTrend();
    }
  }, [selectedPlayer, currentMetric])


  const handleMetricChange = (metric: string) => {
    setCurrentMetric(metric);
  };

  if (!selectedPlayer && !loadingProfile && !loadingTrend && !loadingEvents) {
     return (
      <>
        <PageHeader title="Player Analysis" />
        <DataPlaceholder state="empty" title="No Player Selected" message="Please select a player from the sidebar to view their analysis." />
      </>
    );
  }
  
  if (apiError && process.env.NEXT_PUBLIC_DATA_SOURCE === 'api' && !profile && !loadingProfile) { // Show general API error if profile failed
    return (
      <>
        <PageHeader title="Player Analysis" />
        <DataPlaceholder state="error" title="API Error" message="Could not fetch player data from the API." />
      </>
    );
  }


  return (
    <>
      <PageHeader title="Player Analysis">
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </PageHeader>

      <Card className="mb-6 rounded-[1rem] shadow-soft overflow-hidden border-2 border-accent/50">
        {loadingProfile || !profile ? <DataPlaceholder state="loading" className="min-h-[200px]" /> : (
          <div className="flex flex-col md:flex-row items-center p-6 gap-6 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground">
            {profile.photoUrl && (
              <Image
                src={profile.photoUrl}
                alt={profile.name}
                width={120}
                height={120}
                className="rounded-full border-4 border-accent"
                data-ai-hint="player photo"
              />
            )}
            <div className="flex-1 text-center md:text-left">
              <h2 className="font-headline text-3xl font-bold">{profile.name}</h2>
              <p className="text-lg text-accent">{profile.position}</p>
              <div className="mt-2 flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-1 text-sm">
                <span>Age: {profile.age}</span>
                <span>Nationality: {profile.nationality}</span>
                {profile.teamBadgeUrl && (
                    <Image src={profile.teamBadgeUrl} alt="Team Badge" width={20} height={20} className="inline-block ml-1" data-ai-hint="team badge" />
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center md:text-right mt-4 md:mt-0">
              <div><div className="font-bold text-xl">{profile.appearances}</div><div className="text-xs">Appearances</div></div>
              <div><div className="font-bold text-xl">{profile.goals}</div><div className="text-xs">Goals</div></div>
              <div><div className="font-bold text-xl">{profile.assists}</div><div className="text-xs">Assists</div></div>
              <div><div className="font-bold text-xl">{profile.minutesPlayed}</div><div className="text-xs">Minutes</div></div>
            </div>
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-[1rem] shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">Performance Trend</CardTitle>
             <Tabs value={currentMetric} onValueChange={handleMetricChange} className="w-full pt-2">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="xG">xG</TabsTrigger>
                <TabsTrigger value="passes">Passes</TabsTrigger>
                <TabsTrigger value="defensive_actions">Def. Actions</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            {loadingTrend || (!performanceData && process.env.NEXT_PUBLIC_DATA_SOURCE !== 'api') ? <DataPlaceholder state="loading" className="h-[300px]" /> : (!performanceData || performanceData.data.length === 0) ? <DataPlaceholder state="empty" title="No Trend Data" message={`Performance trend for ${currentMetric} is not available.`} className="h-[300px]" /> : (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData.data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="hsl(var(--accent))" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} name={performanceData.metricName} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-[1rem] shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">Event Map</CardTitle>
          </CardHeader>
          <CardContent>
             {loadingEvents ? <DataPlaceholder state="loading" className="h-[300px]" /> : eventMapData.length === 0 && !loadingEvents ? <DataPlaceholder state="empty" title="No Event Data" message="Event map data is not available for this player." className="h-[300px]" /> : (
              <SoccerPitchSVG className="aspect-[105/68]">
                {eventMapData.map(event => (
                  <circle
                    key={event.id}
                    cx={`${event.x}%`}
                    cy={`${event.y}%`}
                    r="5"
                    fill={event.type === 'shot' ? 'hsl(var(--chart-1))' : event.type === 'pass' ? 'hsl(var(--chart-2))' : 'hsl(var(--chart-3))'}
                    opacity="0.7"
                  >
                    <title>{`${event.type} (${event.outcome}) at ${event.minute}'`}</title>
                  </circle>
                ))}
              </SoccerPitchSVG>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
