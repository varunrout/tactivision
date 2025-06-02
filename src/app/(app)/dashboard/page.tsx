"use client";

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { StatCard } from '@/components/shared/stat-card';
import { Button } from '@/components/ui/button';
import { Download, BarChartBig, Target } from 'lucide-react';
import type { DashboardSummary, XgTimelinePoint, ShotEvent } from '@/types';
import { useFilters } from '@/contexts/filter-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area } from 'recharts';
import SoccerPitchSVG from '@/components/icons/soccer-pitch-svg';
import Image from 'next/image';
import { DataPlaceholder } from '@/components/shared/data-placeholder';
import { MOCK_TEAMS as MOCK_TEAMS_DATA } from '@/lib/constants';

const fetchDashboardSummary = async (matchId: string | null): Promise<DashboardSummary | null> => {
  if (!matchId) return null;
  const dataSource = process.env.NEXT_PUBLIC_DATA_SOURCE;

  if (dataSource === 'api') {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await fetch(`${baseUrl}/dashboard/summary?match_id=${matchId}`);
      if (!response.ok) {
        console.error('API Error: Failed to fetch dashboard summary', response.status, response.statusText);
        return null;
      }
      const data: DashboardSummary = await response.json();
      return data;
    } catch (error) {
      console.error('Fetch Error: Could not fetch dashboard summary from API', error);
      return null;
    }
  } else {
    // Mock data logic
    await new Promise(resolve => setTimeout(resolve, 1000));
    const teamId = "team1"; 
    const team = (MOCK_TEAMS_DATA as any)["s1-2324"]?.find((t: any) => t.id === teamId);
    const opponentTeam = (MOCK_TEAMS_DATA as any)["s1-2324"]?.find((t: any) => t.id === "team2");

    return {
      teamName: team?.name || "Home Team",
      opponentName: opponentTeam?.name || "Away Team",
      scoreline: "3 - 1",
      date: new Date().toISOString(),
      venue: "Etihad Stadium",
      xgTotalHome: 2.8,
      xgTotalAway: 1.2,
      possessionHome: 65,
      possessionAway: 35,
      passAccuracyHome: 88,
      passAccuracyAway: 75,
      shotsOnTargetHome: 7,
      shotsOnTargetAway: 3,
      teamLogoUrl: team?.logoUrl || "https://placehold.co/40x40.png?text=TH",
      opponentLogoUrl: opponentTeam?.logoUrl || "https://placehold.co/40x40.png?text=TA",
    };
  }
};

const fetchXgTimeline = async (matchId: string | null): Promise<XgTimelinePoint[]> => {
  if (!matchId) return [];
  const dataSource = process.env.NEXT_PUBLIC_DATA_SOURCE;

  if (dataSource === 'api') {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await fetch(`${baseUrl}/dashboard/xg-timeline?match_id=${matchId}`);
      if (!response.ok) {
        console.error('API Error: Failed to fetch XG timeline', response.status, response.statusText);
        return [];
      }
      const data: XgTimelinePoint[] = await response.json();
      return data;
    } catch (error) {
      console.error('Fetch Error: Could not fetch XG timeline from API', error);
      return [];
    }
  } else {
    // Mock data logic
    await new Promise(resolve => setTimeout(resolve, 1200));
    return Array.from({ length: 90 }, (_, i) => ({
      minute: i + 1,
      homeXg: parseFloat((Math.random() * (i / 90) * 3).toFixed(2)),
      awayXg: parseFloat((Math.random() * (i / 90) * 2).toFixed(2)),
    }));
  }
};

const fetchShotMapEvents = async (matchId: string | null): Promise<ShotEvent[]> => {
  if (!matchId) return [];
  const dataSource = process.env.NEXT_PUBLIC_DATA_SOURCE;

  if (dataSource === 'api') {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await fetch(`${baseUrl}/dashboard/shot-map?match_id=${matchId}`);
      if (!response.ok) {
        console.error('API Error: Failed to fetch shot map events', response.status, response.statusText);
        return [];
      }
      const data: ShotEvent[] = await response.json();
      return data;
    } catch (error) {
      console.error('Fetch Error: Could not fetch shot map events from API', error);
      return [];
    }
  } else {
    // Mock data logic
    await new Promise(resolve => setTimeout(resolve, 1500));
    return [
      { id: 's1', minute: 15, player: 'Player A', team: 'Home', x: 85, y: 50, xg: 0.3, outcome: 'Goal' },
      { id: 's2', minute: 30, player: 'Player B', team: 'Away', x: 70, y: 40, xg: 0.1, outcome: 'Saved' },
      { id: 's3', minute: 65, player: 'Player C', team: 'Home', x: 90, y: 60, xg: 0.5, outcome: 'Goal' },
      { id: 's4', minute: 70, player: 'Player A', team: 'Home', x: 75, y: 30, xg: 0.2, outcome: 'Missed' },
    ];
  }
};


export default function DashboardPage() {
  const { selectedMatch } = useFilters();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [xgTimeline, setXgTimeline] = useState<XgTimelinePoint[]>([]);
  const [shotEvents, setShotEvents] = useState<ShotEvent[]>([]);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [loadingXg, setLoadingXg] = useState(true);
  const [loadingShots, setLoadingShots] = useState(true);
  const [apiError, setApiError] = useState(false);

  useEffect(() => {
    if (selectedMatch) {
      setLoadingSummary(true);
      setLoadingXg(true);
      setLoadingShots(true);
      setApiError(false);

      const loadData = async () => {
        const summaryData = await fetchDashboardSummary(selectedMatch.id);
        const xgData = await fetchXgTimeline(selectedMatch.id);
        const shotsData = await fetchShotMapEvents(selectedMatch.id);

        if (process.env.NEXT_PUBLIC_DATA_SOURCE === 'api' && (!summaryData || !xgData || !shotsData)) {
          setApiError(true);
        }

        setSummary(summaryData);
        setXgTimeline(xgData || []);
        setShotEvents(shotsData || []);
        
        setLoadingSummary(false);
        setLoadingXg(false);
        setLoadingShots(false);
      };
      loadData();
      
    } else {
      setSummary(null);
      setXgTimeline([]);
      setShotEvents([]);
      setLoadingSummary(false);
      setLoadingXg(false);
      setLoadingShots(false);
      setApiError(false);
    }
  }, [selectedMatch]);

  if (!selectedMatch && !loadingSummary && !loadingXg && !loadingShots) {
    return (
      <>
        <PageHeader title="Dashboard" />
        <DataPlaceholder state="empty" title="No Match Selected" message="Please select a match from the sidebar to view dashboard statistics." />
      </>
    );
  }
   if (apiError && process.env.NEXT_PUBLIC_DATA_SOURCE === 'api') {
    return (
      <>
        <PageHeader title="Match Dashboard" />
        <DataPlaceholder state="error" title="API Error" message="Could not fetch data from the API. Please ensure the API is running and the data source is correctly configured." />
      </>
    );
  }
  
  return (
    <>
      <PageHeader title="Match Dashboard">
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </PageHeader>

      <div className="mb-8">
        {loadingSummary || !summary ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => <StatCard key={i} title="" value="" isLoading={true} />)}
          </div>
        ) : (
          <Card className="rounded-[1rem] shadow-soft p-4 sm:p-6 glassmorphic-panel">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                {summary.teamLogoUrl && <Image src={summary.teamLogoUrl} alt={summary.teamName} width={40} height={40} data-ai-hint="team logo"/>}
                <h2 className="text-xl font-semibold text-foreground">{summary.teamName}</h2>
              </div>
              <div className="text-3xl font-bold text-accent font-headline">{summary.scoreline}</div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold text-foreground">{summary.opponentName}</h2>
                {summary.opponentLogoUrl && <Image src={summary.opponentLogoUrl} alt={summary.opponentName} width={40} height={40} data-ai-hint="team logo"/>}
              </div>
            </div>
            <p className="text-sm text-center text-muted-foreground mb-6">{new Date(summary.date).toLocaleDateString()} - {summary.venue}</p>
            
            <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              <StatCard title="Possession" value={`${summary.possessionHome}%`} description={`${summary.possessionAway}% away`} />
              <StatCard title="Expected Goals (xG)" value={summary.xgTotalHome.toFixed(1)} description={`${summary.xgTotalAway.toFixed(1)} away`} />
              <StatCard title="Pass Accuracy" value={`${summary.passAccuracyHome}%`} description={`${summary.passAccuracyAway}% away`} />
              <StatCard title="Shots on Target" value={summary.shotsOnTargetHome} description={`${summary.shotsOnTargetAway} away`} />
              <StatCard title="Match Status" value="Full Time" className="hidden lg:block" />
            </div>
          </Card>
        )}
      </div>
      
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-[1rem] shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChartBig className="h-5 w-5 text-accent" />
              xG Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingXg ? <DataPlaceholder state="loading" /> : xgTimeline.length === 0 && !loadingXg ? <DataPlaceholder state="empty" title="No xG Data" message="xG timeline data is not available for this match."/> : (
              <div className="h-[300px] w-full">
                <ResponsiveContainer>
                  <AreaChart data={xgTimeline}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="minute" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--popover))', 
                        borderColor: 'hsl(var(--border))',
                        borderRadius: '0.5rem',
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)'
                      }}
                      labelStyle={{ color: 'hsl(var(--popover-foreground))', fontWeight: 'bold' }}
                      itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
                    />
                    <Area type="monotone" dataKey="homeXg" stackId="1" stroke="hsl(var(--chart-1))" fill="hsl(var(--chart-1))" fillOpacity={0.3} name={summary?.teamName || "Home"} />
                    <Area type="monotone" dataKey="awayXg" stackId="1" stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2))" fillOpacity={0.3} name={summary?.opponentName || "Away"} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-[1rem] shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="h-5 w-5 text-accent" />
              Shot Map
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingShots ? <DataPlaceholder state="loading" /> : shotEvents.length === 0 && !loadingShots ? <DataPlaceholder state="empty" title="No Shot Data" message="Shot map data is not available for this match."/> : (
              <SoccerPitchSVG className="aspect-[105/68]">
                {shotEvents.map(shot => (
                  <circle
                    key={shot.id}
                    cx={`${shot.x}%`}
                    cy={`${shot.y}%`}
                    r={Math.max(5, shot.xg * 20)} 
                    fill={shot.outcome === 'Goal' ? 'hsl(var(--chart-4))' : 'hsl(var(--chart-5))'}
                    fillOpacity="0.7"
                    stroke="hsl(var(--foreground))"
                    strokeWidth="1"
                    data-ai-hint="shot event visualization"
                  >
                    <title>{`Player: ${shot.player}\nMinute: ${shot.minute}\nOutcome: ${shot.outcome}\nxG: ${shot.xg}`}</title>
                  </circle>
                ))}
              </SoccerPitchSVG>
            )}
            <div className="mt-2 flex items-center justify-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-[hsl(var(--chart-4))]"></div> Goal</span>
                <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-[hsl(var(--chart-5))]"></div> No Goal</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
