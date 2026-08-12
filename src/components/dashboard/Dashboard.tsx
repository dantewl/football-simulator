import { useStore } from '../../store/useStore';
import { Trophy, Users, Calendar, TrendingUp, Target, AlertCircle } from 'lucide-react';

export default function Dashboard() {
  const { club, players, matches } = useStore();
  
  const nextMatch = matches.find(m => m.status === 'scheduled');
  const recentMatches = matches.filter(m => m.status === 'finished').slice(0, 3);
  const topScorers = players.filter(p => p.mainPosition !== 'GK').sort((a, b) => b.careerStats.goals - a.careerStats.goals).slice(0, 3);
  const injuredPlayers = players.filter(p => p.status === 'injured');
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-dark-100 mb-2">Dashboard</h1>
        <p className="text-dark-400">Visã££o geral do seu clube</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard icon={Trophy} title="Pró¡¡´xima Partida" value={nextMatch ? `${nextMatch.homeTeam.club.shortName} vs ${nextMatch.awayTeam.club.shortName}` : 'Nenhuma'} subvalue={nextMatch ? new Date(nextMatch.date).toLocaleDateString('pt-BR') : '-'} color="primary" />
        <DashboardCard icon={Users} title="Elenco" value={players.length.toString()} subvalue="Jogadores" color="blue" />
        <DashboardCard icon={Calendar} title="Temporada" value={club?.seasonObjective || 'N/A'} subvalue="Objetivo" color="green" />
        <DashboardCard icon={TrendingUp} title="Reputaç££o" value={`${club?.reputation || 0}/100`} subvalue={`Ní¡¡vel ${club?.level || 0}`} color="purple" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-primary-500" />
            <h3 className="text-lg font-semibold text-dark-100">Pró¡¡´xima Partida</h3>
          </div>
          {nextMatch ? (
            <div className="flex items-center justify-between p-6 bg-dark-900 rounded-lg">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary-600 flex items-center justify-center mb-2">
                  <span className="text-xl font-bold text-white">{nextMatch.homeTeam.club.abbreviation}</span>
                </div>
                <p className="text-sm font-medium text-dark-100">{nextMatch.homeTeam.club.shortName}</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-dark-100">VS</p>
                <p className="text-xs text-dark-400 mt-1">{new Date(nextMatch.date).toLocaleDateString('pt-BR')}</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-dark-700 flex items-center justify-center mb-2">
                  <span className="text-xl font-bold text-dark-100">{nextMatch.awayTeam.club.abbreviation}</span>
                </div>
                <p className="text-sm font-medium text-dark-100">{nextMatch.awayTeam.club.shortName}</p>
              </div>
            </div>
          ) : (
            <p className="text-dark-400">Nenhuma partida agendada</p>
          )}
        </div>
        
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <h3 className="text-lg font-semibold text-dark-100">Artilheiros</h3>
          </div>
          <div className="space-y-3">
            {topScorers.map((player, index) => (
              <div key={player.id} className="flex items-center justify-between p-3 bg-dark-900 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-sm font-bold text-white">{index + 1}</div>
                  <div>
                    <p className="font-medium text-dark-100">{player.firstName}</p>
                    <p className="text-xs text-dark-400">{player.mainPosition}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-dark-100">{player.careerStats.goals}</p>
                  <p className="text-xs text-dark-400">gols</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-green-500" />
            <h3 className="text-lg font-semibold text-dark-100">Ú¡ltimos Resultados</h3>
          </div>
          <div className="space-y-2">
            {recentMatches.map((match) => (
              <div key={match.id} className="flex items-center justify-between p-3 bg-dark-900 rounded-lg">
                <span className="text-sm text-dark-300">{match.homeTeam.club.shortName} {match.homeScore} - {match.awayScore} {match.awayTeam.club.shortName}</span>
                <span className={`text-xs font-medium px-2 py-1 rounded ${match.homeScore > match.awayScore ? 'bg-green-600 text-white' : match.homeScore < match.awayScore ? 'bg-red-600 text-white' : 'bg-dark-600 text-dark-100'}`}>
                  {match.homeScore > match.awayScore ? 'V' : match.homeScore < match.awayScore ? 'D' : 'E'}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <h3 className="text-lg font-semibold text-dark-100">Lesionados</h3>
          </div>
          {injuredPlayers.length > 0 ? (
            <div className="space-y-2">
              {injuredPlayers.map((player) => (
                <div key={player.id} className="flex items-center justify-between p-3 bg-dark-900 rounded-lg">
                  <div>
                    <p className="font-medium text-dark-100">{player.firstName}</p>
                    <p className="text-xs text-dark-400">{player.mainPosition}</p>
                  </div>
                  <span className="text-xs text-red-400">Lesionado</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-dark-400">Nenhum jogador lesionado</p>
          )}
        </div>
      </div>
    </div>
  );
}

function DashboardCard({ icon: Icon, title, value, subvalue, color }: { icon: any, title: string, value: string, subvalue: string, color: string }) {
  const colorClasses: Record<string, string> = { primary: 'bg-primary-600', blue: 'bg-blue-600', green: 'bg-green-600', purple: 'bg-purple-600', red: 'bg-red-600', yellow: 'bg-yellow-600' };
  
  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-dark-400 mb-1">{title}</p>
          <p className="text-2xl font-bold text-dark-100">{value}</p>
          <p className="text-xs text-dark-400 mt-1">{subvalue}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}
