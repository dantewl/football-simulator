import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameState, Club, Player, Match, Competition, Season, GameSettings, SaveFile } from '../types';

interface GameStore extends GameState {
  setClub: (club: Club) => void;
  updateClub: (club: Partial<Club>) => void;
  addPlayer: (player: Player) => void;
  updatePlayer: (player: Player) => void;
  removePlayer: (playerId: string) => void;
  getPlayers: () => Player[];
  getPlayer: (playerId: string) => Player | undefined;
  addMatch: (match: Match) => void;
  updateMatch: (match: Match) => void;
  getMatches: () => Match[];
  setCompetitions: (competitions: Competition[]) => void;
  getCompetitions: () => Competition[];
  setCurrentSeason: (season: Season) => void;
  updateSettings: (settings: Partial<GameSettings>) => void;
  saveGame: (name?: string) => string;
  loadGame: (saveId: string) => boolean;
  exportGame: () => string;
  importGame: (data: string) => boolean;
  deleteSave: (saveId: string) => void;
  getSaves: () => SaveFile[];
  resetGame: () => void;
  setDemoMode: (isDemo: boolean) => void;
}

const defaultSettings: GameSettings = {
  autoSave: true,
  notifications: true,
  simulationSpeed: 'normal',
  varEnabled: true,
  injuriesEnabled: true,
  transfersEnabled: true,
  language: 'pt',
};

const initialState: GameState = {
  club: null,
  players: [],
  currentSeason: null,
  matches: [],
  competitions: [],
  history: [],
  settings: defaultSettings,
  isDemo: false,
};

export const useStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      setClub: (club) => set({ club }),
      updateClub: (clubUpdate) => {
        const current = get().club;
        if (current) set({ club: { ...current, ...clubUpdate } });
      },
      
      addPlayer: (player) => set({ players: [...get().players, player] }),
      updatePlayer: (player) => set({ players: get().players.map(p => p.id === player.id ? player : p) }),
      removePlayer: (playerId) => set({ players: get().players.filter(p => p.id !== playerId) }),
      getPlayers: () => get().players,
      getPlayer: (playerId) => get().players.find(p => p.id === playerId),
      
      addMatch: (match) => set({ matches: [...get().matches, match] }),
      updateMatch: (match) => set({ matches: get().matches.map(m => m.id === match.id ? match : m) }),
      getMatches: () => get().matches,
      
      setCompetitions: (competitions) => set({ competitions }),
      getCompetitions: () => get().competitions,
      
      setCurrentSeason: (season) => set({ currentSeason: season }),
      
      updateSettings: (settingsUpdate) => set({ settings: { ...get().settings, ...settingsUpdate } }),
      
      saveGame: (name) => {
        const state = get();
        const saves = getSavesFromStorage();
        const newSave: SaveFile = {
          id: `save_${Date.now()}`,
          name: name || `Save ${new Date().toLocaleDateString('pt-BR')}`,
          date: new Date().toISOString(),
          clubName: state.club?.name || 'Sem clube',
          season: state.currentSeason?.year || 'N/A',
          data: { ...state },
        };
        saves.push(newSave);
        localStorage.setItem('football_sim_saves', JSON.stringify(saves));
        return newSave.id;
      },
      
      loadGame: (saveId) => {
        const saves = getSavesFromStorage();
        const save = saves.find(s => s.id === saveId);
        if (save) { set({ ...save.data }); return true; }
        return false;
      },
      
      exportGame: () => JSON.stringify(get(), null, 2),
      
      importGame: (data) => {
        try {
          const parsed = JSON.parse(data);
          set({ ...parsed });
          return true;
        } catch {
          return false;
        }
      },
      
      deleteSave: (saveId) => {
        const saves = getSavesFromStorage();
        localStorage.setItem('football_sim_saves', JSON.stringify(saves.filter(s => s.id !== saveId)));
      },
      
      getSaves: () => getSavesFromStorage(),
      
      resetGame: () => set(initialState),
      setDemoMode: (isDemo) => set({ isDemo }),
    }),
    {
      name: 'football-sim-storage',
      partialize: (state) => ({
        club: state.club,
        players: state.players,
        currentSeason: state.currentSeason,
        matches: state.matches,
        competitions: state.competitions,
        history: state.history,
        settings: state.settings,
        isDemo: state.isDemo,
      }),
    }
  )
);

function getSavesFromStorage(): SaveFile[] {
  const saves = localStorage.getItem('football_sim_saves');
  return saves ? JSON.parse(saves) : [];
}

export function useSaves() {
  return getSavesFromStorage();
}
