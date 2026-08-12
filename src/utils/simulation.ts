import { MatchEvent, MatchTeam, MatchStats } from '../types';
import { calculateTeamStrength, calculateWinProbabilities } from './calculations';

class SeededRandom {
  private seed: number;
  
  constructor(seed?: number) {
    this.seed = seed || Math.floor(Math.random() * 1000000);
  }
  
  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }
  
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }
  
  chance(percent: number): boolean {
    return this.next() * 100 < percent;
  }
}

export function simulateMatch(homeTeam: MatchTeam, awayTeam: MatchTeam, seed?: number): { events: MatchEvent[]; stats: MatchStats; homeScore: number; awayScore: number } {
  const rng = new SeededRandom(seed);
  const events: MatchEvent[] = [];
  const homeStrength = calculateTeamStrength(homeTeam);
  const awayStrength = calculateTeamStrength(awayTeam);
  
  const stats: MatchStats = {
    possession: { home: 50, away: 50 },
    shots: { home: 0, away: 0 },
    shotsOnTarget: { home: 0, away: 0 },
    corners: { home: 0, away: 0 },
    fouls: { home: 0, away: 0 },
    yellowCards: { home: 0, away: 0 },
    redCards: { home: 0, away: 0 },
    passes: { home: 0, away: 0 },
    passAccuracy: { home: 85, away: 85 },
    bigChances: { home: 0, away: 0 },
    xG: { home: 0, away: 0 },
  };
  
  const strengthRatio = homeStrength / (homeStrength + awayStrength);
  const homePossession = Math.round(40 + (strengthRatio * 20));
  stats.possession = { home: homePossession, away: 100 - homePossession };
  
  for (let minute = 1; minute <= 90; minute++) {
    if (rng.chance(5)) {
      generateEvent(rng, minute, homeTeam, awayTeam, homeStrength, awayStrength, events, stats);
    }
  }
  
  stats.passes = { home: Math.round(homePossession * 8), away: Math.round((100 - homePossession) * 8) };
  
  const homeScore = events.filter(e => e.type === 'goal' && e.team === 'home').length;
  const awayScore = events.filter(e => e.type === 'goal' && e.team === 'away').length;
  
  return { events, stats, homeScore, awayScore };
}

function generateEvent(rng: SeededRandom, minute: number, homeTeam: MatchTeam, awayTeam: MatchTeam, homeStrength: number, awayStrength: number, events: MatchEvent[], stats: MatchStats): void {
  const homeHasBall = rng.next() * 100 < stats.possession.home;
  const attackingTeam = homeHasBall ? homeTeam : awayTeam;
  const attackingSide: 'home' | 'away' = homeHasBall ? 'home' : 'away';
  const defendingSide: 'home' | 'away' = homeHasBall ? 'away' : 'home';
  
  const eventType = rng.nextInt(1, 100);
  
  if (eventType <= 40) {
    generateShot(rng, minute, attackingTeam, attackingSide, events, stats);
  } else if (eventType <= 60) {
    stats.fouls[defendingSide]++;
    events.push({ id: `evt_${minute}_${events.length}`, minute, type: 'foul', team: defendingSide, description: 'Falta cometida.' });
  } else if (eventType <= 75) {
    stats.corners[attackingSide]++;
    events.push({ id: `evt_${minute}_${events.length}`, minute, type: 'corner', team: attackingSide, description: 'Escanteio.' });
  } else if (eventType <= 85) {
    const isRed = rng.chance(15);
    const player = attackingTeam.lineup[rng.nextInt(0, attackingTeam.lineup.length - 1)];
    if (isRed) {
      stats.redCards[attackingSide]++;
      events.push({ id: `evt_${minute}_${events.length}`, minute, type: 'redCard', team: attackingSide, playerId: player.id, playerName: player.firstName, description: `Cartã££o VERMELHO para ${player.firstName}!`, rating: -1.5 });
    } else {
      stats.yellowCards[attackingSide]++;
      events.push({ id: `evt_${minute}_${events.length}`, minute, type: 'yellowCard', team: attackingSide, playerId: player.id, playerName: player.firstName, description: `Cartã££o amarelo para ${player.firstName}.`, rating: -0.5 });
    }
  } else if (eventType <= 95) {
    stats.bigChances[attackingSide]++;
    stats.xG[attackingSide] += 0.5;
    const player = attackingTeam.lineup[rng.nextInt(0, attackingTeam.lineup.length - 1)];
    events.push({ id: `evt_${minute}_${events.length}`, minute, type: 'bigChance', team: attackingSide, playerId: player.id, playerName: player.firstName, description: `Grande chance para ${player.firstName}!`, rating: 0.3 });
    if (rng.chance(50)) {
      events.push({ id: `evt_${minute + 1}_${events.length}`, minute: minute + 1, type: 'goal', team: attackingSide, playerId: player.id, playerName: player.firstName, description: `GOL! ${player.firstName} marca!`, rating: 1.5 });
    }
  } else {
    events.push({ id: `evt_${minute}_${events.length}`, minute, type: 'injury', team: attackingSide, description: 'Jogador lesionado.' });
  }
}

function generateShot(rng: SeededRandom, minute: number, attackingTeam: MatchTeam, attackingSide: 'home' | 'away', events: MatchEvent[], stats: MatchStats): void {
  const player = attackingTeam.lineup[rng.nextInt(0, attackingTeam.lineup.length - 1)];
  stats.shots[attackingSide]++;
  
  const finishing = player.attributes.finishing;
  const onTargetChance = 30 + (finishing / 3);
  
  if (rng.chance(onTargetChance)) {
    stats.shotsOnTarget[attackingSide]++;
    const goalkeeper = attackingTeam.lineup.find(p => p.mainPosition === 'GK');
    const saveChance = goalkeeper ? goalkeeper.attributes.reflexes / 2 : 40;
    
    if (rng.chance(saveChance)) {
      events.push({ id: `evt_${minute}_${events.length}`, minute, type: 'save', team: attackingSide === 'home' ? 'away' : 'home', playerId: goalkeeper?.id, playerName: goalkeeper?.firstName, description: 'Grande defesa!', rating: 0.3 });
    } else {
      events.push({ id: `evt_${minute}_${events.length}`, minute, type: 'goal', team: attackingSide, playerId: player.id, playerName: player.firstName, description: `GOL! ${player.firstName} marca!`, rating: 1.5 });
      stats.xG[attackingSide] += 0.7;
    }
  } else {
    events.push({ id: `evt_${minute}_${events.length}`, minute, type: 'shotOffTarget', team: attackingSide, playerId: player.id, playerName: player.firstName, description: `${player.firstName} chuta pra fora.` });
  }
}

export function simulateMatchQuick(homeTeam: MatchTeam, awayTeam: MatchTeam, seed?: number): { homeScore: number; awayScore: number; events: MatchEvent[] } {
  const rng = new SeededRandom(seed);
  const probs = calculateWinProbabilities(homeTeam, awayTeam);
  const roll = rng.nextInt(1, 100);
  
  let result: 'home' | 'draw' | 'away';
  if (roll <= probs.home) result = 'home';
  else if (roll <= probs.home + probs.draw) result = 'draw';
  else result = 'away';
  
  let homeScore = 0, awayScore = 0;
  const totalGoals = rng.nextInt(1, 4) + rng.nextInt(0, 2);
  
  if (result === 'home') {
    homeScore = rng.nextInt(1, totalGoals + 1);
    awayScore = Math.max(0, homeScore - rng.nextInt(1, 3));
  } else if (result === 'away') {
    awayScore = rng.nextInt(1, totalGoals + 1);
    homeScore = Math.max(0, awayScore - rng.nextInt(1, 3));
  } else {
    const drawScore = rng.nextInt(0, 3);
    homeScore = drawScore;
    awayScore = drawScore;
  }
  
  const events: MatchEvent[] = [];
  for (let i = 0; i < homeScore; i++) {
    const player = homeTeam.lineup[rng.nextInt(0, homeTeam.lineup.length - 1)];
    events.push({ id: `goal_home_${i}`, minute: rng.nextInt(1, 90), type: 'goal', team: 'home', playerId: player.id, playerName: player.firstName, description: `GOL! ${player.firstName} marca!`, rating: 1.5 });
  }
  for (let i = 0; i < awayScore; i++) {
    const player = awayTeam.lineup[rng.nextInt(0, awayTeam.lineup.length - 1)];
    events.push({ id: `goal_away_${i}`, minute: rng.nextInt(1, 90), type: 'goal', team: 'away', playerId: player.id, playerName: player.firstName, description: `GOL! ${player.firstName} marca!`, rating: 1.5 });
  }
  
  events.sort((a, b) => a.minute - b.minute);
  return { homeScore, awayScore, events };
}
