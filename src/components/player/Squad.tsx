import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { Search, User, Shield, TrendingUp } from 'lucide-react';
import { Player, PlayerPosition, ALL_POSITIONS, POSITION_NAMES } from '../../types';

export default function Squad() {
  const { players } = useStore();
  const [filterPosition, setFilterPosition] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredPlayers = players.filter(player => {
    const matchesPosition = filterPosition === 'all' || player.mainPosition === filterPosition;
    const matchesSearch = searchTerm === '' || player.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || player.lastName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesPosition && matchesSearch;
  });
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-dark-100 mb-2">Elenco</h1>
          <p className="text-dark-400">{players.length} jogadores</p>
        </div>
        <Link to="/player/create" className="btn-primary">
          <User className="w-5 h-5 mr-2" />
          Criar Jogador
        </Link>
      </div>
      
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-400" />
              <input type="text" placeholder="Buscar jogador..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="input w-full pl-10" />
            </div>
          </div>
          <div>
            <select value={filterPosition} onChange={(e) => setFilterPosition(e.target.value)} className="input">
              <option value="all">Todas as posiç££es</option>
              {ALL_POSITIONS.map(pos => (<option key={pos} value={pos}>{POSITION_NAMES[pos]}</option>))}
            </select>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {ALL_POSITIONS.map(position => {
          const positionPlayers = filteredPlayers.filter(p => p.mainPosition === position);
          if (positionPlayers.length === 0) return null;
          
          return (
            <div key={position} className="card">
              <h3 className="text-lg font-semibold text-dark-100 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary-500" />
                {POSITION_NAMES[position]} ({positionPlayers.length})
              </h3>
              <div className="space-y-2">
                {positionPlayers.map(player => (
                  <PlayerCard key={player.id} player={player} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PlayerCard({ player }: { player: Player }) {
  return (
    <div className="flex items-center justify-between p-3 bg-dark-900 rounded-lg hover:bg-dark-800 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center">
          <span className="text-sm font-bold text-white">{player.shirtNumber}</span>
        </div>
        <div>
          <p className="font-medium text-dark-100">{player.nickname || player.firstName}</p>
          <p className="text-xs text-dark-400">{player.age} anos • {player.nationality}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-lg font-bold text-dark-100">{player.overall}</span>
          </div>
          <p className="text-xs text-dark-400">Overall</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-dark-100">R$ {(player.marketValue / 1000000).toFixed(1)}M</p>
          <p className="text-xs text-dark-400">Valor</p>
        </div>
      </div>
    </div>
  );
}
