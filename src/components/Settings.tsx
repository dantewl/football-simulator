import { useStore } from '../store/useStore';
import { Settings as SettingsIcon, Save, Download, Upload, Trash2 } from 'lucide-react';

export default function Settings() {
  const { settings, updateSettings, getSaves, deleteSave, resetGame } = useStore();
  const saves = getSaves();
  
  const handleExport = () => {
    const data = useStore.getState().exportGame();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `football-sim-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = event.target?.result as string;
        if (useStore.getState().importGame(data)) {
          alert('Carreira importada com sucesso!');
        } else {
          alert('Erro ao importar carreira');
        }
      };
      reader.readAsText(file);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-dark-100 mb-2">Configuraç££es</h1>
        <p className="text-dark-400">Gerencie suas preferê££ncias e dados</p>
      </div>
      
      <section className="card">
        <h2 className="text-xl font-semibold text-dark-100 mb-6 flex items-center gap-2"><SettingsIcon className="w-5 h-5 text-primary-500" />Configuraç££es de Jogo</h2>
        <div className="space-y-4">
          <ToggleSetting label="Salvamento Automá¡¡tico" description="Salvar automaticamente após cada partida" enabled={settings.autoSave} onToggle={() => updateSettings({ autoSave: !settings.autoSave })} />
          <ToggleSetting label="Notificaç££es" description="Mostrar notificaç££es de eventos importantes" enabled={settings.notifications} onToggle={() => updateSettings({ notifications: !settings.notifications })} />
          <ToggleSetting label="VAR" description="Habilitar revisã££o por vídeo" enabled={settings.varEnabled} onToggle={() => updateSettings({ varEnabled: !settings.varEnabled })} />
          <ToggleSetting label="Lesõµµµes" description="Habilitar sistema de lesõµµµes" enabled={settings.injuriesEnabled} onToggle={() => updateSettings({ injuriesEnabled: !settings.injuriesEnabled })} />
          <div>
            <label className="label">Velocidade de Simulaç££o</label>
            <select value={settings.simulationSpeed} onChange={(e) => updateSettings({ simulationSpeed: e.target.value as any })} className="input w-full">
              <option value="slow">Lenta</option>
              <option value="normal">Normal</option>
              <option value="fast">Rá¡¡pida</option>
            </select>
          </div>
        </div>
      </section>
      
      <section className="card">
        <h2 className="text-xl font-semibold text-dark-100 mb-6 flex items-center gap-2"><Save className="w-5 h-5 text-primary-500" />Gerenciar Saves</h2>
        <div className="space-y-4">
          {saves.length > 0 ? (
            <div className="space-y-2">
              {saves.map(save => (
                <div key={save.id} className="flex items-center justify-between p-4 bg-dark-900 rounded-lg">
                  <div>
                    <p className="font-medium text-dark-100">{save.name}</p>
                    <p className="text-sm text-dark-400">{save.clubName} • {new Date(save.date).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <button onClick={() => { if (confirm('Tem certeza que deseja apagar este save?')) deleteSave(save.id); }} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-dark-400">Nenhum save encontrado</p>
          )}
        </div>
      </section>
      
      <section className="card">
        <h2 className="text-xl font-semibold text-dark-100 mb-6">Exportar e Importar</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button onClick={handleExport} className="btn-primary">
            <Download className="w-5 h-5 mr-2" />Exportar Carreira
          </button>
          <label className="btn-secondary cursor-pointer">
            <Upload className="w-5 h-5 mr-2" />Importar Carreira
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
        </div>
      </section>
      
      <section className="card border-red-900">
        <h2 className="text-xl font-semibold text-red-500 mb-4">Resetar Jogo</h2>
        <p className="text-dark-400 mb-4">Isso apagará¡¡ todos os dados do jogo e retornará¡¡ ao estado inicial.</p>
        <button onClick={() => { if (confirm('TEM CERTEZA? Isso apagará¡¡ todo o seu progresso!')) { resetGame(); localStorage.clear(); window.location.reload(); } }} className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
          Resetar Tudo
        </button>
      </section>
    </div>
  );
}

function ToggleSetting({ label, description, enabled, onToggle }: { label: string; description: string; enabled: boolean; onToggle: () => void }) {
  return (
    <div className="flex items-center justify-between p-4 bg-dark-900 rounded-lg">
      <div>
        <p className="font-medium text-dark-100">{label}</p>
        <p className="text-sm text-dark-400">{description}</p>
      </div>
      <button onClick={onToggle} className={`w-12 h-6 rounded-full transition-colors ${enabled ? 'bg-primary-600' : 'bg-dark-600'}`}>
        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${enabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
      </button>
    </div>
  );
}
