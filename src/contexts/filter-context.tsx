"use client";

import type { Competition, Season, Team, Match, Player } from '@/types';
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface FilterState {
  selectedCompetition: Competition | null;
  selectedSeason: Season | null;
  selectedTeam: Team | null;
  selectedMatch: Match | null;
  selectedPlayer: Player | null;
}

interface FilterContextType extends FilterState {
  setCompetition: (competition: Competition | null) => void;
  setSeason: (season: Season | null) => void;
  setTeam: (team: Team | null) => void;
  setMatch: (match: Match | null) => void;
  setPlayer: (player: Player | null) => void;
  clearFilters: () => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedCompetition, setSelectedCompetition] = useState<Competition | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<Season | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const setCompetition = useCallback((competition: Competition | null) => {
    setSelectedCompetition(competition);
    setSelectedSeason(null);
    setSelectedTeam(null);
    setSelectedMatch(null);
    setSelectedPlayer(null);
  }, []);

  const setSeason = useCallback((season: Season | null) => {
    setSelectedSeason(season);
    setSelectedTeam(null);
    setSelectedMatch(null);
    setSelectedPlayer(null);
  }, []);

  const setTeam = useCallback((team: Team | null) => {
    setSelectedTeam(team);
    setSelectedMatch(null);
    setSelectedPlayer(null);
  }, []);

  const setMatch = useCallback((match: Match | null) => {
    setSelectedMatch(match);
    // Optionally clear player if match changes context away from a specific player
    // setSelectedPlayer(null); 
  }, []);

  const setPlayer = useCallback((player: Player | null) => {
    setSelectedPlayer(player);
  }, []);
  
  const clearFilters = useCallback(() => {
    setSelectedCompetition(null);
    setSelectedSeason(null);
    setSelectedTeam(null);
    setSelectedMatch(null);
    setSelectedPlayer(null);
  }, []);

  return (
    <FilterContext.Provider value={{
      selectedCompetition,
      selectedSeason,
      selectedTeam,
      selectedMatch,
      selectedPlayer,
      setCompetition,
      setSeason,
      setTeam,
      setMatch,
      setPlayer,
      clearFilters,
    }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilters = (): FilterContextType => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
};
