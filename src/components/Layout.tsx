import { Outlet, Link, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Home, Users, UserPlus, Calendar, Trophy, Settings, Save, Download, Upload, Shield, Activity, Play } from 'lucide-react';

export default function Layout() {
  const { club } = useStore();
  const location = useLocation();
  
  const menuItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/squad', icon: Users, label: 'Elenco' },
    { path: '/player/create', icon: UserPlus, label: 'Criar Jogador' },
    { path: '/match/next', icon: Play, label: 'Partida' },
    { path: '/season', icon: Calendar, label: 'Temporada' },
    { path: '/trophies', icon: Trophy, label: 'Tí¡¡tulos' },
    { path: '/settings', icon: Settings, label: 'Configuraç££es' },
  ];
  
  return (
    <div className="min-h-screen bg-dark-950 flex">
      <aside className="w-64 bg-dark-900 border-r border-dark-800 flex flex-col">
        <div className="p-6 border-b border-dark-800">
          {club ? (
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: club.primaryColor }}>
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-dark-100">{club.shortName}</h1>
                <p className="text-xs text-dark-400">{club.name}</p>
              </div>
            </div>
          ) : (
            <h1 className="font-bold text-xl text-dark-100">Football Sim</h1>
          )}
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                location.pathname === item.path ? 'bg-primary-600 text-white' : 'text-dark-300 hover:bg-dark-800 hover:text-dark-100'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        
        <div className="p-4 border-t border-dark-800 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-2 text-dark-300 hover:bg-dark-800 rounded-lg transition-colors">
            <Save className="w-5 h-5" />
            <span>Salvar</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2 text-dark-300 hover:bg-dark-800 rounded-lg transition-colors">
            <Download className="w-5 h-5" />
            <span>Exportar</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2 text-dark-300 hover:bg-dark-800 rounded-lg transition-colors">
            <Upload className="w-5 h-5" />
            <span>Importar</span>
          </button>
        </div>
      </aside>
      
      <main className="flex-1 overflow-auto">
        <header className="bg-dark-900 border-b border-dark-800 px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Activity className="w-6 h-6 text-primary-500" />
              <h2 className="text-xl font-semibold text-dark-100">Football Simulator</h2>
            </div>
            {club && (
              <div className="text-right">
                <p className="text-sm text-dark-300">Temporada 2024/2025</p>
                <p className="text-xs text-dark-400">Ní¡¡vel: {club.level}</p>
              </div>
            )}
          </div>
        </header>
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
