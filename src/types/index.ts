export interface Club {
  id: string;
  name: string;
  shortName: string;
  abbreviation: string;
  country: string;
  city: string;
  foundedYear: number;
  stadium: string;
  stadiumCapacity: number;
  budget: number;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  crest: string;
  homeKit: Kit;
  awayKit: Kit;
  philosophy: string;
  level: number;
  seasonObjective: string;
  reputation: number;
}

export interface Kit {
  shirtColor: string;
  shortsColor: string;
  socksColor: string;
  pattern?: 'solid' | 'stripes' | 'hoops' | 'gradient';
}

export type PlayerPosition = 'GK' | 'CB' | 'RB' | 'LB' | 'CDM' | 'CM' | 'CAM' | 'RW' | 'LW' | 'ST' | 'CF';

export type PlayerTrait = 'dribbler' | 'speedster' | 'playmaker' | 'finisher' | 'setpiece' | 'header' | 'aggressive' | 'leader' | 'clutch' | 'inconsistent' | 'counter' | 'false9' | 'target' | 'sweeper' | 'biggame' | 'injury_prone' | 'temperamental' | 'disciplined' | 'prospect' | 'veteran';

export interface Player {
  id: string;
  clubId: string;
  firstName: string;
  lastName: string;
  nickname?: string;
  gender: 'male' | 'female';
  nationality: string;
  age: number;
  birthDate: string;
  height: number;
  weight: number;
  dominantFoot: 'right' | 'left' | 'both';
  nonDominantFoot: number;
  shirtNumber: number;
  mainPosition: PlayerPosition;
  secondaryPositions: PlayerPosition[];
  personality: string;
  potential: number;
  status: 'active' | 'injured' | 'suspended' | 'transferred' | 'retired';
  avatar?: string;
  attributes: PlayerAttributes;
  traits: PlayerTrait[];
  overall: number;
  positionRatings: Record<PlayerPosition, number>;
  estimatedValue: number;
  estimatedSalary: number;
  form: number;
  chemistry: number;
  consistency: number;
  injuryRisk: number;
  playingStyle: string;
  careerStats: CareerStats;
  contract: Contract;
  marketValue: number;
  salary: number;
  history: ClubHistory[];
  nationalTeamCallups: number;
  awards: PlayerAward[];
  personalRecords: PersonalRecords;
}

export interface PlayerAttributes {
  dribbling: number;
  ballControl: number;
  ballCarrying: number;
  sprint: number;
  acceleration: number;
  topSpeed: number;
  balance: number;
  agility: number;
  strength: number;
  stamina: number;
  jumping: number;
  heading: number;
  shortPassing: number;
  longPassing: number;
  crossing: number;
  vision: number;
  finishing: number;
  longShots: number;
  shotPower: number;
  attackingPositioning: number;
  defending: number;
  tackling: number;
  interceptions: number;
  marking: number;
  defensivePositioning: number;
  reflexes: number;
  handling: number;
  penaltySaving: number;
  distribution: number;
}

export interface CareerStats {
  matchesPlayed: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  minutesPlayed: number;
  averageRating: number;
  cleanSheets: number;
  saves: number;
}

export interface Contract {
  startDate: string;
  endDate: string;
  salary: number;
  releaseClause?: number;
}

export interface ClubHistory {
  clubId: string;
  clubName: string;
  startDate: string;
  endDate?: string;
  matchesPlayed: number;
  goals: number;
  assists: number;
}

export interface PlayerAward {
  season: string;
  award: string;
  competition: string;
}

export interface PersonalRecords {
  mostGoalsInSeason: number;
  mostAssistsInSeason: number;
  highestRating: number;
  longestGoalStreak: number;
  hatTricks: number;
}

export interface Match {
  id: string;
  competitionId: string;
  round: number;
  date: string;
  homeTeam: MatchTeam;
  awayTeam: MatchTeam;
  venue: string;
  attendance?: number;
  weather?: Weather;
  referee?: string;
  status: 'scheduled' | 'live' | 'finished' | 'postponed';
  homeScore: number;
  awayScore: number;
  halfTimeScore?: { home: number; away: number };
  events: MatchEvent[];
  stats?: MatchStats;
  seed?: number;
}

export interface MatchTeam {
  clubId: string;
  club: Club;
  formation: Formation;
  lineup: Player[];
  bench: Player[];
  tactics: Tactics;
}

export type Formation = '4-4-2' | '4-3-3' | '4-2-3-1' | '3-5-2' | '3-4-3' | '5-3-2' | '4-1-4-1' | '3-4-1-2';

export interface Tactics {
  mentality: 'defensive' | 'balanced' | 'attacking';
  pressure: 'low' | 'medium' | 'high';
  width: number;
  depth: number;
  buildUpSpeed: 'slow' | 'balanced' | 'fast';
  attackingStyle: 'possession' | 'counter' | 'direct';
  defensiveStyle: 'press' | 'block' | 'mixed';
}

export interface MatchEvent {
  id: string;
  minute: number;
  type: EventType;
  team: 'home' | 'away';
  playerId?: string;
  playerName?: string;
  description: string;
  x?: number;
  y?: number;
  rating?: number;
}

export type EventType = 'goal' | 'assist' | 'shot' | 'shotOnTarget' | 'shotOffTarget' | 'save' | 'bigChance' | 'corner' | 'foul' | 'yellowCard' | 'redCard' | 'injury' | 'substitution' | 'offside' | 'penalty' | 'penaltyMiss' | 'penaltySave' | 'var' | 'tacticalChange' | 'pressure' | 'error' | 'highlight';

export interface MatchStats {
  possession: { home: number; away: number };
  shots: { home: number; away: number };
  shotsOnTarget: { home: number; away: number };
  corners: { home: number; away: number };
  fouls: { home: number; away: number };
  yellowCards: { home: number; away: number };
  redCards: { home: number; away: number };
  passes: { home: number; away: number };
  passAccuracy: { home: number; away: number };
  bigChances: { home: number; away: number };
  xG: { home: number; away: number };
}

export interface Weather {
  type: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'snowy';
  temperature: number;
  humidity: number;
}

export interface Competition {
  id: string;
  name: string;
  type: 'league' | 'cup' | 'superCup' | 'continental' | 'world';
  country?: string;
  teams: CompetitionTeam[];
  format: CompetitionFormat;
  currentSeason: string;
  seasons: CompetitionSeason[];
  logo?: string;
}

export interface CompetitionTeam {
  clubId: string;
  club: Club;
  points: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  form: ('W' | 'D' | 'L')[];
  position?: number;
}

export interface CompetitionFormat {
  type: 'league' | 'groups' | 'knockout' | 'combined';
  teams: number;
  rounds?: number;
  groups?: number;
  teamsPerGroup?: number;
  promotionSpots?: number;
  relegationSpots?: number;
  qualificationSpots?: number;
  playoffSpots?: number;
  awayGoalsRule?: boolean;
  extraTime?: boolean;
  penalties?: boolean;
}

export interface CompetitionSeason {
  season: string;
  winner?: string;
  runnerUp?: string;
  topScorer?: { playerId: string; playerName: string; goals: number };
  topAssists?: { playerId: string; playerName: string; assists: number };
  bestPlayer?: { playerId: string; playerName: string };
  finalStandings: CompetitionTeam[];
}

export interface Season {
  id: string;
  year: string;
  startDate: string;
  endDate: string;
  competitions: Competition[];
  transfers: Transfer[];
  awards: SeasonAward[];
}

export interface Transfer {
  id: string;
  playerId: string;
  player: Player;
  fromClubId?: string;
  toClubId: string;
  date: string;
  fee?: number;
  type: 'permanent' | 'loan' | 'free' | 'youth';
}

export interface SeasonAward {
  award: string;
  playerId: string;
  player: Player;
  competitionId?: string;
}

export interface GameState {
  club: Club | null;
  players: Player[];
  currentSeason: Season | null;
  matches: Match[];
  competitions: Competition[];
  history: Season[];
  settings: GameSettings;
  isDemo: boolean;
}

export interface GameSettings {
  autoSave: boolean;
  notifications: boolean;
  simulationSpeed: 'slow' | 'normal' | 'fast';
  varEnabled: boolean;
  injuriesEnabled: boolean;
  transfersEnabled: boolean;
  language: 'pt' | 'en' | 'es';
}

export interface SaveFile {
  id: string;
  name: string;
  date: string;
  clubName: string;
  season: string;
  data: GameState;
}

export const ALL_POSITIONS: PlayerPosition[] = ['GK', 'CB', 'RB', 'LB', 'CDM', 'CM', 'CAM', 'RW', 'LW', 'ST', 'CF'];

export const POSITION_NAMES: Record<PlayerPosition, string> = {
  'GK': 'Goleiro', 'CB': 'Zagueiro', 'RB': 'Lateral-direito', 'LB': 'Lateral-esquerdo',
  'CDM': 'Volante', 'CM': 'Meio-campista', 'CAM': 'Meia ofensivo',
  'RW': 'Ponta-direita', 'LW': 'Ponta-esquerda', 'ST': 'Centroavante', 'CF': 'Segundo atacante',
};

export const TRAIT_NAMES: Record<PlayerTrait, string> = {
  'dribbler': 'Driblador', 'speedster': 'Velocista', 'playmaker': 'Armador', 'finisher': 'Finalizador',
  'setpiece': 'Bolas Paradas', 'header': 'Cabeceador', 'aggressive': 'Agressivo', 'leader': 'Lí¡¡der',
  'clutch': 'Decisivo', 'inconsistent': 'Inconsistente', 'counter': 'Contra-ataque', 'false9': 'Falso 9',
  'target': 'Pivô´´´', 'sweeper': 'Goleiro-Linha', 'biggame': 'Jogos Grandes', 'injury_prone': 'Lesõµµµes',
  'temperamental': 'Temperamental', 'disciplined': 'Disciplinado', 'prospect': 'Promessa', 'veteran': 'Veterano',
};
