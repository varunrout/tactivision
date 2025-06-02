
export interface Competition {
  competition_id: string;
  competition_name: string;
}

export interface Season {
  id: string;
  name: string; // e.g., "2023/2024"
}

export interface Team {
  id: string;
  name:string;
  logoUrl?: string;
}

export interface Match {
  id: string;
  name: string; // e.g., "Team A vs Team B - YYYY-MM-DD"
  date: string;
}

export interface Player {
  id: string;
  name: string;
  position?: string;
  age?: number;
  nationality?: string;
  teamBadgeUrl?: string;
  photoUrl?: string;
}

// Dashboard
export interface DashboardSummary {
  teamName: string;
  opponentName: string;
  scoreline: string; // e.g., "3 - 1"
  date: string; // ISO string
  venue: string;
  xgTotalHome: number;
  xgTotalAway: number;
  possessionHome: number;
  possessionAway: number;
  passAccuracyHome: number;
  passAccuracyAway: number;
  shotsOnTargetHome: number;
  shotsOnTargetAway: number;
  teamLogoUrl?: string;
  opponentLogoUrl?: string;
}

export interface XgTimelinePoint {
  minute: number;
  homeXg: number;
  awayXg: number;
}

export interface ShotEvent {
  id: string;
  minute: number;
  player: string;
  team: string;
  x: number; // coordinate on pitch (0-100)
  y: number; // coordinate on pitch (0-100)
  xg: number; // expected goals value
  outcome: 'Goal' | 'Saved' | 'Missed' | 'Blocked';
}

// Player Analysis
export interface PlayerProfile extends Player {
  appearances: number;
  goals: number;
  assists: number;
  minutesPlayed: number;
}

export interface PerformanceTrendData {
  metricName: string;
  data: Array<{ date: string; value: number }>; // Could be match dates or time periods
}

export interface PlayerEvent {
  id: string;
  type: 'pass' | 'shot' | 'tackle' | 'dribble' | 'interception';
  x: number;
  y: number;
  outcome: 'success' | 'fail' | 'neutral';
  minute: number;
}

// Player Comparison
export interface RadarDataPoint {
  metric: string;
  playerAValue: number;
  playerBValue: number;
  fullMark?: number; // Max value for this metric on radar
}

export interface BarChartDataPoint {
  metric: string;
  playerAValue: number;
  playerBValue: number;
}

export interface ScatterPlotDataPoint {
  player: Player;
  xValue: number; // e.g., xG/90
  yValue: number; // e.g., xA/90
}

export interface SimilarityNode extends Player {
  similarityScore?: number; // relative to the base player
}
export interface SimilarityLink {
  source: string; // player ID
  target: string; // player ID
  strength: number;
}
export interface SimilarityMapData {
  nodes: SimilarityNode[];
  links: SimilarityLink[];
}


// Tactical Insights (examples)
export interface DefensiveMetricItem {
  playerOrTeamName: string;
  tackles: number;
  interceptions: number;
  clearances: number;
  blocks: number;
}

export interface PassNetworkNode {
  id: string; // player ID
  name: string;
  avgX: number;
  avgY: number;
  positionGroup: 'defense' | 'midfield' | 'attack';
}
export interface PassNetworkLink {
  source: string; // player ID
  target: string; // player ID
  passCount: number;
}
export interface PassNetworkData {
  nodes: PassNetworkNode[];
  links: PassNetworkLink[];
}

// Matchup Analysis
export interface HeadToHeadStats {
  teamAWins: number;
  teamBWins: number;
  draws: number;
  teamAGoals: number;
  teamBGoals: number;
  lastMeetings: Array<{ date: string; scoreline: string; winner?: 'teamA' | 'teamB' | 'draw' }>;
}

export interface TeamStyleMetrics {
  possession: number;
  directness: number;
  pressIntensity: number;
  buildupSpeed: number;
  // ... other metrics
}

export interface MatchPrediction {
  homeWinProbability: number;
  drawProbability: number;
  awayWinProbability: number;
  keyDrivers?: string[]; // textual explanation
}
