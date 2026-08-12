import { Player, PlayerPosition, MatchTeam } from '../types';

export function calculateOverall(player: Player): number {
  const weights = getPositionWeights(player.mainPosition);
  let total = 0;
  let weightSum = 0;
  
  for (const [attr, value] of Object.entries(player.attributes)) {
    const weight = weights[attr as keyof typeof weights] || 1;
    total += value * weight;
    weightSum += weight;
  }
  
  return Math.round(total / weightSum);
}

export function calculatePositionRating(player: Player, position: PlayerPosition): number {
  const weights = getPositionWeights(position);
  let total = 0;
  let weightSum = 0;
  
  for (const [attr, value] of Object.entries(player.attributes)) {
    const weight = weights[attr as keyof typeof weights] || 1;
    total += value * weight;
    weightSum += weight;
  }
  
  const positionPenalty = position !== player.mainPosition ? 5 : 0;
  return Math.max(1, Math.round(total / weightSum) - positionPenalty);
}

function getPositionWeights(position: PlayerPosition): Record<string, number> {
  const positionWeights: Record<PlayerPosition, Record<string, number>> = {
    'GK': { reflexes: 5, handling: 5, penaltySaving: 4, distribution: 3, jumping: 3 },
    'CB': { defending: 5, tackling: 5, marking: 5, defensivePositioning: 5, heading: 4, strength: 4, interceptions: 4 },
    'RB': { defending: 4, tackling: 4, crossing: 4, stamina: 4, acceleration: 4, topSpeed: 3, marking: 3 },
    'LB': { defending: 4, tackling: 4, crossing: 4, stamina: 4, acceleration: 4, topSpeed: 3, marking: 3 },
    'CDM': { defending: 4, tackling: 4, interceptions: 5, shortPassing: 4, stamina: 4, positioning: 4, strength: 3 },
    'CM': { shortPassing: 4, vision: 4, ballControl: 4, stamina: 4, defending: 3, longPassing: 3, positioning: 4 },
    'CAM': { vision: 5, shortPassing: 4, ballControl: 4, dribbling: 4, finishing: 3, attackingPositioning: 4, longShots: 3 },
    'RW': { dribbling: 4, ballControl: 4, acceleration: 4, topSpeed: 4, crossing: 4, finishing: 3, agility: 4 },
    'LW': { dribbling: 4, ballControl: 4, acceleration: 4, topSpeed: 4, crossing: 4, finishing: 3, agility: 4 },
    'ST': { finishing: 5, attackingPositioning: 5, shotPower: 4, heading: 3, strength: 3, acceleration: 3, topSpeed: 3 },
    'CF': { finishing: 4, attackingPositioning: 4, vision: 4, shortPassing: 4, dribbling: 4, ballControl: 4, longShots: 3 },
  };
  
  return positionWeights[position] || {};
}

export function calculateMarketValue(player: Player): number {
  const baseValue = 100000;
  const ageFactor = player.age < 21 ? 1.3 : player.age < 24 ? 1.2 : player.age < 28 ? 1.0 : player.age < 31 ? 0.85 : player.age < 34 ? 0.6 : 0.4;
  const overallFactor = player.overall / 50;
  const potentialFactor = player.potential / 70;
  const formFactor = player.form / 5;
  const traitBonus = 1 + (player.traits.length * 0.1);
  
  const value = baseValue * overallFactor * potentialFactor * ageFactor * formFactor * traitBonus;
  return Math.round(value / 1000) * 1000;
}

export function calculateSalary(player: Player): number {
  return Math.round(calculateMarketValue(player) / 12);
}

export function calculateTeamStrength(team: MatchTeam): number {
  const lineupStrength = team.lineup.reduce((sum, p) => sum + p.overall, 0) / team.lineup.length;
  const benchStrength = team.bench.length > 0 ? team.bench.reduce((sum, p) => sum + p.overall, 0) / team.bench.length : lineupStrength * 0.8;
  const chemistryFactor = 1 + (getTeamChemistry(team) / 200);
  const formFactor = 1 + (getTeamForm(team) / 100);
  const clubLevelFactor = team.club.level / 100;
  
  const baseStrength = (lineupStrength * 0.7) + (benchStrength * 0.2) + (clubLevelFactor * 10);
  return Math.round(baseStrength * chemistryFactor * formFactor);
}

function getTeamChemistry(team: MatchTeam): number {
  const sameClub = team.lineup.filter(p => p.clubId === team.clubId).length;
  return Math.round((sameClub / team.lineup.length) * 100);
}

function getTeamForm(team: MatchTeam): number {
  if (team.lineup.length === 0) return 5;
  return team.lineup.reduce((sum, p) => sum + p.form, 0) / team.lineup.length;
}

export function calculatePlayingStyle(player: Player): string {
  const styles: string[] = [];
  const { attributes, traits } = player;
  
  if (attributes.dribbling >= 80 || attributes.ballControl >= 80) styles.push('Té¡¡cnico');
  if (attributes.topSpeed >= 80 || attributes.acceleration >= 80) styles.push('Veloz');
  if (attributes.strength >= 80) styles.push('Fí¡¡sico');
  if (attributes.vision >= 80 || attributes.shortPassing >= 80) styles.push('Criativo');
  if (attributes.finishing >= 80) styles.push('Artilheiro');
  if (attributes.defending >= 80 || attributes.tackling >= 80) styles.push('Defensor');
  if (traits.includes('leader')) styles.push('Lí¡¡der');
  if (traits.includes('clutch')) styles.push('Decisivo');
  
  return styles.join(' • ') || 'Completo';
}

export function calculateConsistency(player: Player): number {
  let consistency = 70;
  if (player.traits.includes('inconsistent')) consistency -= 20;
  if (player.traits.includes('disciplined') || player.traits.includes('veteran')) consistency += 10;
  consistency += (player.form - 5) * 2;
  if (player.age >= 26) consistency += 5;
  return Math.max(30, Math.min(100, consistency));
}

export function calculateInjuryRisk(player: Player): number {
  let risk = 10;
  if (player.age > 32) risk += 15;
  else if (player.age > 28) risk += 5;
  if (player.traits.includes('injury_prone')) risk += 25;
  if (player.form < 5) risk += 10;
  return Math.min(100, risk);
}

export function calculateWinProbabilities(homeTeam: MatchTeam, awayTeam: MatchTeam): { home: number; draw: number; away: number } {
  const homeStrength = calculateTeamStrength(homeTeam);
  const awayStrength = calculateTeamStrength(awayTeam);
  const homeAdvantage = 5;
  
  const totalStrength = homeStrength + awayStrength;
  const homeProb = (homeStrength + homeAdvantage) / (totalStrength + homeAdvantage);
  const awayProb = awayStrength / (totalStrength + homeAdvantage);
  
  const strengthDiff = Math.abs(homeStrength - awayStrength);
  let drawProb = 0.25 - (strengthDiff / 200);
  drawProb = Math.max(0.15, Math.min(0.35, drawProb));
  
  const remaining = 1 - drawProb;
  
  return {
    home: Math.round(homeProb * remaining * 100),
    draw: Math.round(drawProb * 100),
    away: Math.round(awayProb * remaining * 100),
  };
}
