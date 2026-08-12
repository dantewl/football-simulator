import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { Play, Pause, FastForward, RotateCcw, Shield } from 'lucide-react';
import { Match, MatchEvent } from '../../types';
import { simulateMatch } from '../../utils/simulation';

export default function MatchSimulation() {
  const { matchId } = useParams<{ matchId: string }>();
  const navigate = useNavigate();
  const { getMatches } = useStore();
  
  const [match, setMatch] = useState<Match | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentMinute, setCurrentMinute] = useState(0);
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [speed, setSpeed] = useState(1);
  
  useEffect(() => {
    if (matchId) {
      const matches = getMatches();
      const foundMatch = matches.find(m => m.id === matchId || 'next');
      if (foundMatch) setMatch(foundMatch);
      else navigate('/');
    }
  }, [matchId, getMatches, navigate]);
  
  const startSimulation = () => {
    if (!match) return;
    const result = simulateMatch(match.homeTeam, match.awayTeam);
    setEvents(result.events);
    setHomeScore(result.homeScore);
    setAwayScore(result.awayScore);
    setIsPlaying(true);
  };
  
  useEffect(() => {
    if (!isPlaying || events.length === 0) return;
    const interval = setInterval(() => {
      setCurrentMinute(prev => {
        if (prev >= 90) { setIsPlaying(false); return 90; }
        return prev + 1;
      });
    }, 1000 / speed);
    return () => clearInterval(interval);
  }, [isPlaying, speed, events.length]);
  
  const currentEvents = events.filter(e => e.minute <= currentMinute);
  
  if (!match) return <div className="text-dark-400">Carregando partida...</div>;
  
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div className="text-center flex-1">
            <div className="w-20 h-20 rounded-full bg-primary-600 flex items-center justify-center mx-auto mb-2">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <p className="font-bold text-dark-100">{match.homeTeam.club.shortName}</p>
          </div>
          <div className="text-center px-8">
            <div className="text-5xl font-bold text-dark-100 mb-2">{homeScore} - {awayScore}</div>
            <div className="text-2xl font-bold text-primary-500">{currentMinute}'</div>
            <p className="text-sm text-dark-400">{match.competitionId} • Rodada {match.round}</p>
          </div>
          <div className="text-center flex-1">
            <div className="w-20 h-20 rounded-full bg-dark-700 flex items-center justify-center mx-auto mb-2">
              <Shield className="w-10 h-10 text-dark-100" />
            </div>
            <p className="font-bold text-dark-100">{match.awayTeam.club.shortName}</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-4">
          {!isPlaying && currentMinute === 0 ? (
            <button onClick={startSimulation} className="btn-primary">
              <Play className="w-5 h-5 mr-2" />Iniciar Partida
            </button>
          ) : (
            <>
              <button onClick={() => setIsPlaying(!isPlaying)} className="btn-secondary">
                {isPlaying ? <Pause className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
                {isPlaying ? 'Pausar' : 'Continuar'}
              </button>
              <button onClick={() => setSpeed(speed === 1 ? 5 : speed === 5 ? 10 : 1)} className="btn-secondary">
                <FastForward className="w-5 h-5 mr-2" />{speed}x
              </button>
              <button onClick={() => { setCurrentMinute(0); setEvents([]); setHomeScore(0); setAwayScore(0); setIsPlaying(false); }} className="btn-secondary">
                <RotateCcw className="w-5 h-5 mr-2" />Reiniciar
              </button>
            </>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card">
          <h3 className="text-lg font-semibold text-dark-100 mb-4">Feed de Eventos</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {currentEvents.length === 0 ? (
              <p className="text-dark-400">A partida ainda não começou</p>
            ) : (
              currentEvents.map(event => (
                <div key={event.id} className={`p-3 rounded-lg ${event.team === 'home' ? 'bg-primary-900/30' : 'bg-dark-900'}`}>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-primary-500 w-8">{event.minute}'</span>
                    <span className="text-dark-100">{event.description}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold text-dark-100 mb-4">Estatí¡¡sticas</h3>
          <div className="space-y-3">
            <StatRow label="Posse de bola" home="50%" away="50%" />
            <StatRow label="Chutes" home={events.filter(e => e.type.includes('shot')).length.toString()} away="0" />
            <StatRow label="Chutes no gol" home={events.filter(e => e.type === 'goal').length.toString()} away="0" />
            <StatRow label="Escanteios" home={events.filter(e => e.type === 'corner').length.toString()} away="0" />
            <StatRow label="Faltas" home={events.filter(e => e.type === 'foul').length.toString()} away="0" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatRow({ label, home, away }: { label: string; home: string; away: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-dark-100 font-medium">{home}</span>
      <span className="text-sm text-dark-400">{label}</span>
      <span className="text-dark-100 font-medium">{away}</span>
    </div>
  );
}
