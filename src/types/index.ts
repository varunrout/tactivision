

// API response type for core-selectors/competitions
export interface CompetitionAPI {
  competition_id: number;
  season_id: number; 
  competition_name: string;
  competition_gender?: string | null;
  country_name?: string | null;
  competition_youth?: boolean | null;
  competition_international?: boolean | null;
  season_name?: string | null; 
  match_available_360?: string | null; 
  match_available?: string | null;  
}
// Simplified type for UI and FilterContext
export interface Competition {
  id: string; // Mapped from competition_id
  name: string; // Mapped from competition_name
}


// API response type for core-selectors/seasons
export interface SeasonAPI {
  season_id: number;
  season_name: string;
}
// Simplified type for UI and FilterContext
export interface Season {
  id: string; // Mapped from season_id
  name: string; // Mapped from season_name
}


// API response type for core-selectors/teams
export interface TeamAPI {
  team_id: number;
  team_name: string;
  // logoUrl is NOT in the API response based on CSV
}
// Simplified type for UI and FilterContext
export interface Team {
  id: string; // Mapped from team_id
  name: string; // Mapped from team_name
  logoUrl?: string; // Kept for MOCK_TEAMS compatibility, will be undefined for API data
}


// API response type for core-selectors/matches
export interface APIMatch {
  match_id: number;
  match_date?: string | null;
  kick_off?: string | null;
  competition_id?: number | null;
  competition_name?: string | null;
  country_name?: string | null;
  season_id?: number | null;
  season_name?: string | null;
  home_team_id?: number | null;
  home_team_name?: string | null;
  home_team_gender?: string | null;
  home_team_group?: string | null;
  home_team_country_id?: number | null;
  home_team_country_name?: string | null;
  home_manager_id?: number | null;
  home_manager_name?: string | null;
  away_team_id?: number | null;
  away_team_name?: string | null;
  away_team_gender?: string | null;
  away_team_group?: string | null;
  away_team_country_id?: number | null;
  away_team_country_name?: string | null;
  away_manager_id?: number | null;
  away_manager_name?: string | null;
  home_score?: number | null;
  away_score?: number | null;
  match_status?: string | null;
  match_status_360?: string | null;
  last_updated?: string | null; 
  last_updated_360?: string | null; 
  data_version?: string | null;
  shot_fidelity_version?: string | null;
  xy_fidelity_version?: string | null;
  match_week?: number | null;
  competition_stage_id?: number | null;
  competition_stage_name?: string | null;
  stadium_id?: number | null;
  stadium_name?: string | null;
  stadium_country_id?: number | null;
  stadium_country_name?: string | null;
  referee_id?: number | null;
  referee_name?: string | null;
  referee_country_id?: number | null;
  referee_country_name?: string | null;
}
// Simplified version for selectors in sidebar (can be derived from APIMatch)
export interface Match { // Renamed from MatchForSelector for context compatibility
  id: string; // Mapped from match_id
  name: string; // e.g. "Home Team vs Away Team - Date", constructed
  date: string; // Mapped from match_date
}


// API response type for core-selectors/players
export interface APIPlayer {
  player_id: number;
  player_name: string;
  position_id?: number | null;
  position_name?: string | null;
  jersey_number?: number | null;
  // These fields are not in core-selectors/players API response but might be in PlayerProfile
  age?: number;
  nationality?: string;
  teamBadgeUrl?: string; 
  photoUrl?: string;
}
// Player type for context, extends APIPlayer
export interface Player extends APIPlayer {
  // id: string; // No longer needed if context uses APIPlayer directly with player_id
  // name: string; // Already in APIPlayer
}


// Dashboard
// API Response for GET /dashboard/summary?match_id={id}
// Based on CSV: {'metrics': {'goals': 86, 'xG': 72.69, ...}, 'events': [...]}
// The UI currently expects DashboardSummary for a single match.
// The provided CSV example seems to be a team's season summary.
// Assuming the endpoint /dashboard/summary?match_id={id} returns something closer to existing DashboardSummary.
// Will keep DashboardSummary as is for now, assuming API will match or be adapted.
export interface DashboardSummary {
  teamName: string; 
  opponentName: string; 
  scoreline: string; 
  date: string; 
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


// API Response for GET /dashboard/xg-timeline?match_id={id}
// CSV: {'matches': [{'match_id': ..., 'xg': ..., 'goals': ...}], 'cumulative': ...}
// This is a list of matches' xG, not an in-match timeline.
// UI expects in-match timeline. Will keep XgTimelinePoint as is for now.
export interface XgTimelinePoint { // For in-match timeline (UI expectation)
  minute: number;
  homeXg: number;
  awayXg: number;
}
export interface XgTimelineMatchAPI { // From CSV /dashboard/xg-timeline
    match_id: number;
    opponent: string | null; // 'N/A' in example
    xg: number;
    goals: number;
}
export interface XgTimelineResponseAPI { // From CSV /dashboard/xg-timeline
    matches: XgTimelineMatchAPI[];
    cumulative: {
        xg: number[];
        goals: number[];
    }
}


// API Response for GET /dashboard/shot-map?match_id={id}
// CSV: {'shots': [{'x': ..., 'y': ..., 'xg': ..., 'outcome': ..., 'minute': ..., 'player_id': ...}]}
export interface ShotEventAPI {
  x: number;
  y: number;
  xg: number;
  outcome: 'Goal' | 'Saved' | 'Missed' | 'Blocked' | 'Post' | 'Wayward' | 'Saved Off Target' | string; // Allow string for flexibility
  minute: number;
  player_id: number | null; // CSV example had float
  team_id?: number; 
}
export interface ShotMapResponseAPI {
    shots: ShotEventAPI[];
}
// For UI (current structure, can be mapped from ShotEventAPI)
export interface ShotEvent {
  id: string; // Client-generated or from a more detailed API if available
  minute: number;
  player: string; // Needs resolution from player_id
  team: 'Home' | 'Away' | string; // Needs resolution from team_id
  x: number;
  y: number;
  xg: number;
  outcome: string;
}


// Player Analysis
// API Response for GET /player-analysis/profile?player_id={id}
export interface PlayerProfileInfoAPI {
  player_id: number;
  name: string; // CSV example was 'Player 40724'
  team?: string;
  position?: string;
}
export interface PlayerProfilePlayingTimeAPI {
  matches_played?: number;
  minutes_played?: number;
  minutes_per_match?: number;
}
export interface PlayerProfilePerformanceMetricsAPI {
  goals?: number;
  assists?: number;
  xg?: number;
  shots?: number;
  passes_completed?: number;
  pass_accuracy?: number;
}
export interface PlayerProfilePer90MetricsAPI {
  goals_per_90?: number;
  assists_per_90?: number;
  xg_per_90?: number;
  shots_per_90?: number;
  passes_completed_per_90?: number;
  pass_accuracy_per_90?: number;
}
export interface PlayerProfileFormEntryAPI {
  match_id?: number;
  goals?: number;
  shots?: number;
  passes_completed?: number;
  minutes_played?: number;
}
export interface PlayerProfileResponseAPI {
  player_info: PlayerProfileInfoAPI;
  playing_time?: PlayerProfilePlayingTimeAPI;
  performance_metrics?: PlayerProfilePerformanceMetricsAPI;
  per_90_metrics?: PlayerProfilePer90MetricsAPI;
  form?: PlayerProfileFormEntryAPI[];
  competition_id?: number;
  season_id?: number;
  // Add other fields like age, nationality, photoUrl if they come from this endpoint or need to be merged
  age?: number; // Not in CSV example, keep if needed by UI
  nationality?: string; // Not in CSV, keep if UI needs
  teamBadgeUrl?: string; // Not in CSV, keep if UI needs
  photoUrl?: string; // Not in CSV, keep if UI needs
}
// For UI (current structure, needs mapping from PlayerProfileResponseAPI)
export interface PlayerProfile extends APIPlayer { 
  appearances: number;
  goals: number;
  assists: number;
  minutesPlayed: number;
  // age, nationality, teamBadgeUrl, photoUrl inherited if present in APIPlayer
}


// API Response for GET /player-analysis/performance-trend?player_id={id}&metric={metric}
export interface PerformanceTrendDataPointAPI {
  match_number: number;
  match_id: number;
  opponent?: string | null;
  value: number;
  match_result?: string | null;
}
export interface RollingAverageDataPointAPI {
  match_number: number;
  value: number;
}
export interface PerformanceTrendResponseAPI {
  player_id: number;
  metric: string;
  timeframe?: string;
  trend_data: PerformanceTrendDataPointAPI[];
  rolling_average?: RollingAverageDataPointAPI[];
  competition_id?: number; 
}
// For UI Chart (current structure, needs mapping)
export interface PerformanceTrendData {
  metricName: string;
  data: Array<{ date: string; value: number }>; // 'date' could be match_number or a formatted date string
}


// API Response for GET /player-analysis/event-map?player_id={id}
export interface PlayerEventMapEventAPI { // Renamed from PlayerEventAPI to avoid conflict
  id: string; // Assuming API provides a unique ID for events
  type: string;
  x: number;
  y: number;
  minute: number;
  success?: boolean | string | null; // API has null for success in example
  end_x?: number | null;
  end_y?: number | null;
}
export interface PlayerEventMapResponseAPI {
  player_id: number;
  event_type: string; // e.g., 'shots'
  match_id?: number | null;
  competition_id?: number; 
  events: PlayerEventMapEventAPI[];
}
// For UI (current structure, needs mapping)
export interface PlayerEvent {
  id: string;
  type: 'pass' | 'shot' | 'tackle' | 'dribble' | 'interception' | string; 
  x: number;
  y: number;
  outcome: 'success' | 'fail' | 'neutral' | string; 
  minute: number;
}


// Player Comparison
// API Response for GET /player-comparison/radar?player1={id}&player2={id}
export interface PlayerRadarMetricsAPI {
  [metric_name: string]: number; // All per_90 metrics from example
}
export interface PlayerRadarEntryAPI {
  player_id: number;
  player_name: string;
  team?: string;
  metrics: PlayerRadarMetricsAPI;
}
export interface MetricRangesAPI {
  [metric_name: string]: { min: number; max: number };
}
export interface PlayerRadarResponseAPI {
  players: PlayerRadarEntryAPI[];
  metrics: string[]; 
  metric_ranges?: MetricRangesAPI;
  normalized?: boolean;
}
// For UI Chart (current structure, needs mapping)
export interface RadarDataPoint {
  metric: string;
  playerAValue: number;
  playerBValue: number;
  fullMark?: number; // Typically 100 if normalized, or max from metric_ranges
}


// API Response for GET /player-comparison/bar-chart?player1={id}&player2={id}&metric={metric}
export interface PlayerBarChartEntryAPI {
  player_id: number;
  player_name: string;
  team?: string;
  value: number;
  per_90_value?: number;
  minutes?: number;
}
export interface PlayerBarChartResponseAPI {
  players: PlayerBarChartEntryAPI[];
  metric: string;
  per_90?: boolean;
}
// For UI Chart (current structure, needs mapping)
export interface BarChartDataPoint {
  metric: string; // This would be sub-metrics like 'Goals', 'Assists' if API returns multiple
  playerAValue: number;
  playerBValue: number;
}


// API Response for GET /player-comparison/scatter-plot?player1={id}&player2={id}
export interface ScatterPlotPlayerPointAPI {
  player_id: number;
  player_name?: string;
  team?: string;
  position_group?: string | null;
  x_value: number;
  y_value: number;
  minutes?: number;
  highlighted?: boolean;
}
export interface ScatterPlotResponseAPI {
  players: ScatterPlotPlayerPointAPI[];
  x_metric?: string;
  y_metric?: string;
  x_average?: number;
  y_average?: number;
  min_minutes?: number;
  position_group?: string | null;
}
// For UI Chart (current structure, player is an object. Needs mapping)
export interface ScatterPlotDataPoint {
  player: APIPlayer; 
  xValue: number;
  yValue: number;
}


// API Response for GET /player-comparison/similarity-map?player_id={id}
export interface SimilarityKeyMetricsAPI {
  [metric_name: string]: number;
}
export interface PlayerForSimilarityAPI {
  player_id: number;
  player_name?: string;
  team?: string;
  position?: string | null;
  minutes?: number;
  key_metrics: SimilarityKeyMetricsAPI;
  similarity_score?: number; 
}
export interface SimilarityMapResponseAPI {
  reference_player: PlayerForSimilarityAPI;
  similar_players: PlayerForSimilarityAPI[];
  competition_id?: number;
  season_id?: number;
  min_minutes?: number;
}
// For UI (current structure, needs mapping)
export interface SimilarityNode extends APIPlayer { 
  similarityScore?: number;
}
export interface SimilarityLink {
  source: number; // player_id
  target: number; // player_id
  strength: number;
}
export interface SimilarityMapData {
  nodes: SimilarityNode[];
  links: SimilarityLink[];
}


// Tactical Insights
// API Response for GET /tactical-insights/defensive-metrics
export interface TacticalDefensiveActionsAPI {
  tackles?: number;
  interceptions?: number;
  blocks?: number;
  clearances?: number;
}
export interface TacticalMatchDefensiveMetricsAPI {
  match_id: number;
  ppda?: number;
  defensive_actions?: number | TacticalDefensiveActionsAPI; 
  opponent_xg?: number;
}
export interface TeamDefensiveMetricsSummaryAPI {
  team_id: number;
  competition_id?: number;
  season_id?: number;
  matches_analyzed?: number;
  avg_ppda?: number | null; // CSV example showed 0
  defensive_actions_per_match?: TacticalDefensiveActionsAPI;
  total_defensive_actions?: number;
  avg_opposition_passes?: number;
  avg_challenges?: number;
  avg_opponent_xg?: number;
  match_metrics?: TacticalMatchDefensiveMetricsAPI[];
}
// For UI (current list item structure)
export interface DefensiveMetricItem {
  playerOrTeamName: string;
  tackles: number;
  interceptions: number;
  clearances: number;
  blocks: number;
}


// API Response for GET /tactical-insights/offensive-metrics
export interface TacticalPassingMetricsAPI {
  avg_passes_per_match?: number;
  avg_pass_completion?: number;
  avg_progressive_passes?: number;
}
export interface TacticalShootingMetricsAPI {
  total_shots?: number;
  shots_per_match?: number;
  shots_on_target?: number;
  shot_accuracy?: number;
  total_xg?: number;
  xg_per_match?: number;
}
export interface TacticalGoalsMetricsAPI {
  total?: number;
  per_match?: number;
  xg_difference?: number;
}
export interface TacticalMatchOffensiveMetricsAPI {
  match_id: number;
  possession?: number;
  passes?: number;
  shots?: number;
  xg?: number;
  goals?: number;
}
export interface TeamOffensiveMetricsSummaryAPI {
  team_id: number;
  competition_id?: number;
  season_id?: number;
  matches_analyzed?: number;
  avg_possession?: number;
  passing?: TacticalPassingMetricsAPI;
  shooting?: TacticalShootingMetricsAPI;
  goals?: TacticalGoalsMetricsAPI;
  match_metrics?: TacticalMatchOffensiveMetricsAPI[];
}


// API Response for GET /tactical-insights/pass-network
export interface PassNetworkNodeAPI {
  player_id: number; 
  player_name?: string; 
  avg_x?: number;
  avg_y?: number;
  pass_count?: number; 
}
export interface PassNetworkEdgeAPI {
  source_player_id: number; 
  target_player_id: number; 
  pass_count: number;
}
export interface PassNetworkCentralityMetricsAPI {
  [playerId: string]: number; 
}
export interface PassNetworkAnalysisMetricsAPI {
  betweenness_centrality?: PassNetworkCentralityMetricsAPI;
  eigenvector_centrality?: PassNetworkCentralityMetricsAPI;
  density?: number;
  avg_clustering?: number;
  avg_shortest_path?: number;
}
export interface PassNetworkStyleDetailsAPI {
  style?: string;
  confidence?: number;
  metrics?: { [key: string]: any };
}
export interface PassNetworkMatchInfoAPI {
  match_id?: number;
  home_team_name?: string | null;
  away_team_name?: string | null;
  score?: string | null;
  home_team_id?: number | null;
  away_team_id?: number | null;
}
export interface PassNetworkResponseAPI {
  team_id: number;
  nodes: PassNetworkNodeAPI[];
  edges: PassNetworkEdgeAPI[];
  metrics?: PassNetworkAnalysisMetricsAPI;
  style_analysis?: PassNetworkStyleDetailsAPI;
  match_info?: PassNetworkMatchInfoAPI;
}
// For UI (current structure, needs mapping)
export interface PassNetworkNode {
  id: string; 
  name: string;
  avgX: number;
  avgY: number;
  positionGroup?: 'defense' | 'midfield' | 'attack' | string;
}
export interface PassNetworkLink {
  source: string; 
  target: string; 
  passCount: number;
}
export interface PassNetworkData {
  nodes: PassNetworkNode[];
  links: PassNetworkLink[];
}


// API Response for GET /tactical-insights/team-style
export interface TeamStyleCategoriesAPI {
  build_up?: string;
  pressing?: string;
  attacking?: string;
}
export interface TeamStyleScoresAPI {
  build_up?: number;
  possession?: number;
  pressing?: number;
  directness?: number;
  [key: string]: number | undefined; 
}
export interface TeamKeyMetricsAPI {
  possession?: number;
  ppda?: number;
  pass_completion?: number;
  xg_per_match?: number;
  xg_against_per_match?: number;
  shots_per_match?: number;
  [key: string]: number | undefined; 
}
export interface TeamStyleAnalysisAPI { // This is the main response object
  team_id: number;
  competition_id?: number;
  season_id?: number;
  matches_analyzed?: number;
  primary_style?: string;
  style_categories?: TeamStyleCategoriesAPI;
  style_scores?: TeamStyleScoresAPI;
  key_metrics?: TeamKeyMetricsAPI;
}


// Placeholder types for other tactical insights that had 500 errors
export interface BuildUpAnalysisData { /* Define based on actual response when available */ }
export interface PressingAnalysisData { /* Define based on actual response when available */ }
export interface TransitionAnalysisData { /* Define based on actual response when available */ }
export interface SetPieceAnalysisData { /* Define based on actual response when available */ }
export interface FormationAnalysisData { /* Define based on actual response when available */ }
export interface TeamStyleComparisonData { /* Define based on actual response when available */ }


// Matchup Analysis
// API Response for GET /matchup-analysis/head-to-head
export interface MatchupTeamInfoAPI {
  id: number;
  name?: string | null;
}
export interface MatchupSummaryAPI {
  matches_played?: number;
  team1_wins?: number;
  team2_wins?: number;
  draws?: number;
  team1_goals?: number;
  team2_goals?: number;
  team1_xg?: number;
  team2_xg?: number;
}
export interface HistoricalMatchAPI {
  match_id: number;
  date?: string;
  competition?: string;
  home_team?: string | null; 
  away_team?: string | null; 
  score?: string;
  winner?: 'team1' | 'team2' | 'draw' | string;
  team1_xg?: number;
  team2_xg?: number;
}
export interface HeadToHeadStatsResponseAPI {
  team1: MatchupTeamInfoAPI;
  team2: MatchupTeamInfoAPI;
  summary: MatchupSummaryAPI;
  historical_matches?: HistoricalMatchAPI[];
  competition_id?: number;
  season_id?: number;
}
// For UI (current structure, needs mapping)
export interface HeadToHeadStats {
  teamAWins: number;
  teamBWins: number;
  draws: number;
  teamAGoals: number;
  teamBGoals: number;
  lastMeetings: Array<{ date: string; scoreline: string; winner?: 'teamA' | 'teamB' | 'draw' }>;
}


// API Response for GET /matchup-analysis/team-style
// (This endpoint seems to describe a single team's style, with comparisons)
export interface TeamStyleAPIMetrics { // From CSV example of /matchup-analysis/team-style
  possession?: number;
  build_up_speed?: number;
  width?: number;
  directness?: number;
  pressing_intensity?: number;
  defensive_line_height?: number;
  counter_attack_frequency?: number;
  set_piece_reliance?: number;
  [key: string]: number | undefined;
}
export interface TeamComparisonStyleAPI {
  team_id?: number | null;
  team_name?: string;
  style: TeamStyleAPIMetrics;
}
export interface MatchupTeamStyleResponseAPI { // For /matchup-analysis/team-style?team_id={id}
  team: MatchupTeamInfoAPI; // Contains id and name
  competition_id?: number;
  season_id?: number;
  style_metrics?: string[]; // List of metric names like "possession", "directness"
  team_style: TeamStyleAPIMetrics;
  comparisons?: TeamComparisonStyleAPI[]; // e.g., comparison to League Average
  total_teams_in_competition?: number;
}
// For UI (current structure, two teams for /matchup-analysis/team-style?team1={id}&team2={id})
// The API spec for GET /matchup-analysis/team-style?team1={id}&team2={id} is not provided in CSV.
// Assuming it would return { teamAStyle: TeamStyleMetrics, teamBStyle: TeamStyleMetrics }
export interface TeamStyleMetrics { // This is the UI's current shape per team
  possession: number;
  directness: number;
  pressIntensity: number;
  buildupSpeed: number;
}


// API Response for GET /matchup-analysis/matchup-prediction
export interface WinProbabilityAPI {
  team1: number; 
  team2: number; 
  draw: number;
}
export interface ScoreProbabilityAPI {
  team1_score: number;
  team2_score: number;
  probability: number;
}
export interface MetricDistributionValueAPI {
  mean?: number;
  stddev?: number;
}
export interface MetricDistributionsAPI {
  possession?: { team1: MetricDistributionValueAPI, team2: MetricDistributionValueAPI };
  shots?: { team1: MetricDistributionValueAPI, team2: MetricDistributionValueAPI };
  xg?: { team1: MetricDistributionValueAPI, team2: MetricDistributionValueAPI };
  [metric: string]: { team1: MetricDistributionValueAPI, team2: MetricDistributionValueAPI } | undefined;
}
export interface MatchupFactorAPI {
  factor: string;
  advantage?: 'team1' | 'team2' | string;
  importance?: number;
  description?: string;
}
export interface MatchPredictionResponseAPI {
  team1: MatchupTeamInfoAPI;
  team2: MatchupTeamInfoAPI;
  win_probability: WinProbabilityAPI;
  score_probabilities?: ScoreProbabilityAPI[];
  metric_distributions?: MetricDistributionsAPI;
  key_matchup_factors?: MatchupFactorAPI[];
  competition_id?: number;
}
// For UI (current structure, needs mapping)
export interface MatchPrediction {
  homeWinProbability: number;
  drawProbability: number;
  awayWinProbability: number;
  keyDrivers?: string[];
}


// XT-Analytics 
// API Response for GET /xt-analytics/model
export interface XtModelGridSizeAPI {
    x: number;
    y: number;
}
export interface XtModelPitchDimensionsAPI {
    x: number;
    y: number;
}
export interface XtAnalyticsModelResponseAPI {
  grid_size?: XtModelGridSizeAPI;
  pitch_dimensions?: XtModelPitchDimensionsAPI;
  grid_values?: number[][];
}

// API Response for GET /xt-analytics/player-rankings
export interface PlayerRankingItemAPI {
  player_id?: number | null; 
  team_name?: string | null;
  total_xt?: number | null;
  xt_per_action?: number | null;
  positive_actions?: number | null;
}
export interface XtPlayerRankingsResponseAPI {
  players: PlayerRankingItemAPI[];
}

// API Response for GET /xt-analytics/pass-map
export interface PassMapPassAPI {
  player_id?: number | null; 
  team_name?: string | null;
  start_x?: number | null;
  start_y?: number | null;
  end_x?: number | null;
  end_y?: number | null;
  xt_value?: number | null;
}
export interface XtPassMapResponseAPI {
  passes: PassMapPassAPI[];
}

// API Response for GET /xt-analytics/team-contribution
export interface XtTeamContributionByZoneAPI {
  defensive_third?: number;
  middle_third?: number;
  final_third?: number;
}
export interface XtTeamContributionByPlayerAPI {
  player_id?: number | null; 
  xt?: number;
}
export interface XtTeamContributionByActionTypeAPI {
  [actionType: string]: number;
}
export interface XtTeamContributionByTimePeriodAPI {
  period?: string; 
  xt?: number;
}
export interface XtTeamContributionResponseAPI {
  team_id?: number;
  competition_id?: number;
  match_id?: number | null;
  total_xt?: number;
  by_zone?: XtTeamContributionByZoneAPI;
  by_player?: XtTeamContributionByPlayerAPI[];
  by_action_type?: XtTeamContributionByActionTypeAPI;
  by_time_period?: XtTeamContributionByTimePeriodAPI[];
}

// Note: The simplified types (Competition, Season, Team, Match) are used by FilterContext
// and for some local states in components for easier UI handling.
// The `...API` types represent the direct structure from the backend.
// Mapping occurs in `sidebar-content.tsx` or within page components.

