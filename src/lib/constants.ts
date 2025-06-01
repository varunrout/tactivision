export const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/player-analysis", label: "Player Analysis" },
  { href: "/player-comparison", label: "Player Comparison" },
  { href: "/tactical-insights", label: "Tactical Insights" },
  { href: "/matchup-analysis", label: "Matchup Analysis" },
];

export const MOCK_COMPETITIONS = [
  { id: "comp1", name: "Premier League" },
  { id: "comp2", name: "La Liga" },
  { id: "comp3", name: "Serie A" },
  { id: "comp4", name: "Bundesliga" },
  { id: "comp5", name: "Ligue 1" },
];

export const MOCK_SEASONS = {
  comp1: [
    { id: "s1-2324", name: "2023/2024" },
    { id: "s1-2223", name: "2022/2023" },
  ],
  comp2: [
    { id: "s2-2324", name: "2023/2024" },
  ],
  // ... add more seasons for other competitions
};

export const MOCK_TEAMS = {
  "s1-2324": [ // Teams for Premier League 2023/2024
    { id: "team1", name: "Manchester City", logoUrl: "https://placehold.co/40x40.png?text=MC" },
    { id: "team2", name: "Arsenal", logoUrl: "https://placehold.co/40x40.png?text=AR" },
    { id: "team3", name: "Liverpool", logoUrl: "https://placehold.co/40x40.png?text=LP" },
  ],
   "s2-2324": [ // Teams for La Liga 2023/2024
    { id: "team4", name: "Real Madrid", logoUrl: "https://placehold.co/40x40.png?text=RM" },
    { id: "team5", name: "Barcelona", logoUrl: "https://placehold.co/40x40.png?text=BC" },
  ],
  // ... add more teams
};

export const MOCK_MATCHES = {
  team1: [ // Matches for Manchester City
    { id: "match1", name: "Man City vs Arsenal - 2023-10-08", date: "2023-10-08" },
    { id: "match2", name: "Man City vs Liverpool - 2023-11-25", date: "2023-11-25" },
  ],
  team2: [ // Matches for Arsenal
    { id: "match3", name: "Arsenal vs Man Utd - 2023-09-03", date: "2023-09-03" },
  ]
  // ... add more matches
};

export const MOCK_PLAYERS = {
  team1: [ // Players for Manchester City
    { id: "player1", name: "Erling Haaland", position: "Forward", photoUrl: "https://placehold.co/80x80.png?text=EH" , teamBadgeUrl: MOCK_TEAMS["s1-2324"][0].logoUrl},
    { id: "player2", name: "Kevin De Bruyne", position: "Midfielder", photoUrl: "https://placehold.co/80x80.png?text=KB", teamBadgeUrl: MOCK_TEAMS["s1-2324"][0].logoUrl },
  ],
  team2: [ // Players for Arsenal
    { id: "player3", name: "Bukayo Saka", position: "Forward", photoUrl: "https://placehold.co/80x80.png?text=BS", teamBadgeUrl: MOCK_TEAMS["s1-2324"][1].logoUrl },
  ]
  // ... add more players
};
