import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Calendar, Play, Trophy, TrendingUp } from 'lucide-react';

export default function SeasonSimulation() {
  const { matches, competitions, currentSeason } = useStore();
  const [simulating, setSimulating] = useState(false);
  const [simulatedRounds, setSimulatedRounds] = useState(0);
  
  const scheduledMatches = matches.filter(m => m.status === 'scheduled');
  const finishedMatches = matches.filter(m => m.status === 'finished');
  
  const handleSimulateRound = () => {
    setSimulating(true);
    setTimeout(() => {
      setSimulatedRounds(prev => prev + 1);
      setSimulating(false);
    }, 1000);
  };
  
  const handleSimulateSeason = () => {
    setSimulating(true);
    setTimeout(() => {
      setSimulatedRounds(38);
      setSimulating(false);
    }, 3000);
  };
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-dark-100 mb-2">Simulaç££o de Temporada</h1>
        <p className="text-dark-400">Gerencie e simule sua temporada</p>
      </div>
      
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-dark-100 mb-2">Controles</h3>
            <p className="text-dark-400">{simulatedRounds} de 38 rodadas simuladas</p>
          </div>
          <div className="flex gap-4">
            <button onClick={handleSimulateRound} disabled={simulating} className="btn-primary">
              <Play className="w-5 h-5 mr-2" />Simular Rodada
            </button>
            <button onClick={handleSimulateSeason} disabled={simulating} className="btn-secondary">
              <Calendar className="w-5 h-5 mr-2" />Simular Temporada
            </button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <h3 className="text-lg font-semibold text-dark-100">Competiç££es</h3>
          </div>
          <div className="space-y-4">
            {competitions.map(comp => (
              <div key={comp.id} className="p-4 bg-dark-900 rounded-lg">
                <h4 className="font-semibold text-dark-100 mb-2">{comp.name}</h4>
                <p className="text-sm text-dark-400">{comp.format.teams} times • {comp.format.rounds} rodadas</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <h3 className="text-lg font-semibold text-dark-100">Resumo da Temporada</h3>
          </div>
          <div className="space-y-3">
            <SummaryRow label="Partidas jogadas" value={finishedMatches.length.toString()} />
            <SummaryRow label="Partidas restantes" value={scheduledMatches.length.toString()} />
            <SummaryRow label="Rodadas simuladas" value={`${simulatedRounds}/38`} />
            <SummaryRow label="Temporada" value={currentSeason?.year || 'N/A'} />
          </div>
        </div>
      </div>
      
      <div className="card">
        <h3 className="text-lg font-semibold text-dark-100 mb-4">Ú¡ltimas Partidas</h3>
        <div className="space-y-2">
          {finishedMatches.slice(0, 5).map(match => (
            <div key={match.id} className="flex items-center justify-between p-3 bg-dark-900 rounded-lg">
              <span className="text-sm text-dark-300">Rodada {match.round}</span>
              <span className="font-medium text-dark-100">{match.homeTeam.club.shortName} {match.homeScore} - {match.awayScore} {match.awayTeam.club.shortName}</span>
              <span className={`text-xs font-medium px-2 py-1 rounded ${match.homeScore > match.awayScore ? 'bg-green-600 text-white' : match.homeScore < match.awayScore ? 'bg-red-600 text-white' : 'bg-dark-600 text-dark-100'}`}>
                {match.homeScore > match.awayScore ? 'V' : match.homeScore < match.awayScore ? 'D' : 'E'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between p-3 bg-dark-900 rounded-lg">
      <span className="text-dark-400">{label}</span>
      <span className="font-medium text-dark-100">{value}</span>
    </div>
  );
}
