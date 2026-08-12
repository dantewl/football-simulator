import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { User, Save } from 'lucide-react';
import { Player, PlayerPosition, PlayerTrait, ALL_POSITIONS, POSITION_NAMES, TRAIT_NAMES } from '../../types';
import { calculateOverall, calculatePositionRating, calculateMarketValue, calculateSalary, calculatePlayingStyle, calculateConsistency, calculateInjuryRisk } from '../../utils/calculations';

const defaultAttributes: Record<string, number> = {
  dribbling: 50, ballControl: 50, ballCarrying: 50, sprint: 50, acceleration: 50, topSpeed: 50,
  balance: 50, agility: 50, strength: 50, stamina: 50, jumping: 50, heading: 50,
  shortPassing: 50, longPassing: 50, crossing: 50, vision: 50, finishing: 50, longShots: 50,
  shotPower: 50, attackingPositioning: 50, defending: 50, tackling: 50, interceptions: 50,
  marking: 50, defensivePositioning: 50, reflexes: 50, handling: 50, penaltySaving: 50, distribution: 50,
};

export default function PlayerCreator() {
  const navigate = useNavigate();
  const { club, addPlayer } = useStore();
  
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', nickname: '', gender: 'male' as 'male' | 'female',
    nationality: 'Brasil', age: 20, height: 175, weight: 70, dominantFoot: 'right' as 'right' | 'left' | 'both',
    shirtNumber: 1, mainPosition: 'ST' as PlayerPosition, secondaryPositions: [] as PlayerPosition[],
    personality: 'Equilibrado', potential: 75,
  });
  
  const [attributes, setAttributes] = useState(defaultAttributes);
  const [traits, setTraits] = useState<PlayerTrait[]>([]);
  
  const calculatedStats = {
    overall: calculateOverall({ ...formData, attributes, traits, mainPosition: formData.mainPosition } as Player),
    marketValue: 0, salary: 0, playingStyle: '', consistency: 0, injuryRisk: 0,
  };
  
  calculatedStats.marketValue = calculateMarketValue({ ...formData, attributes, traits, overall: calculatedStats.overall, form: 5 } as Player);
  calculatedStats.salary = calculateSalary({ ...formData, attributes, traits, overall: calculatedStats.overall, form: 5 } as Player);
  calculatedStats.playingStyle = calculatePlayingStyle({ ...formData, attributes, traits } as Player);
  calculatedStats.consistency = calculateConsistency({ ...formData, attributes, traits, form: 5, age: formData.age } as Player);
  calculatedStats.injuryRisk = calculateInjuryRisk({ ...formData, attributes, traits, careerStats: { minutesPlayed: 0 } as any } as Player);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['age', 'height', 'weight', 'shirtNumber', 'potential'].includes(name) ? (parseInt(value) || 0) : value,
    }));
  };
  
  const handleAttributeChange = (attr: string, value: number) => {
    setAttributes(prev => ({ ...prev, [attr]: Math.max(1, Math.min(99, value)) }));
  };
  
  const handleTraitToggle = (trait: PlayerTrait) => {
    setTraits(prev => prev.includes(trait) ? prev.filter(t => t !== trait) : [...prev, trait]);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!club) { alert('Crie um clube primeiro!'); return; }
    
    const newPlayer: Player = {
      id: `player_${Date.now()}`,
      clubId: club.id,
      ...formData,
      attributes: attributes as any,
      traits,
      status: 'active',
      overall: calculatedStats.overall,
      positionRatings: {} as Record<PlayerPosition, number>,
      estimatedValue: calculatedStats.marketValue,
      estimatedSalary: calculatedStats.salary,
      form: 5, chemistry: 50, consistency: calculatedStats.consistency, injuryRisk: calculatedStats.injuryRisk,
      playingStyle: calculatedStats.playingStyle,
      careerStats: { matchesPlayed: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, minutesPlayed: 0, averageRating: 0, cleanSheets: 0, saves: 0 },
      contract: { startDate: new Date().toISOString(), endDate: new Date(Date.now() + 5 * 365 * 24 * 60 * 60 * 1000).toISOString(), salary: calculatedStats.salary },
      marketValue: calculatedStats.marketValue, salary: calculatedStats.salary,
      history: [], nationalTeamCallups: 0, awards: [],
      personalRecords: { mostGoalsInSeason: 0, mostAssistsInSeason: 0, highestRating: 0, longestGoalStreak: 0, hatTricks: 0 },
    };
    
    ALL_POSITIONS.forEach(pos => { newPlayer.positionRatings[pos] = calculatePositionRating(newPlayer, pos); });
    
    addPlayer(newPlayer);
    navigate('/squad');
  };
  
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-dark-100 mb-2">Criar Jogador</h1>
        <p className="text-dark-400">Adicione um novo atleta ao seu elenco</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <section className="card">
          <h2 className="text-xl font-semibold text-dark-100 mb-6 flex items-center gap-2"><User className="w-5 h-5 text-primary-500" />Informaç££es Básicas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div><label className="label" htmlFor="firstName">Nome</label><input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} className="input w-full" required /></div>
            <div><label className="label" htmlFor="lastName">Sobrenome</label><input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} className="input w-full" required /></div>
            <div><label className="label" htmlFor="nickname">Apelido</label><input type="text" id="nickname" name="nickname" value={formData.nickname} onChange={handleInputChange} className="input w-full" /></div>
            <div><label className="label" htmlFor="nationality">Nacionalidade</label><select id="nationality" name="nationality" value={formData.nationality} onChange={handleInputChange} className="input w-full"><option value="Brasil">Brasil</option><option value="Portugal">Portugal</option><option value="Argentina">Argentina</option><option value="Espanha">Espanha</option></select></div>
            <div><label className="label" htmlFor="age">Idade</label><input type="number" id="age" name="age" value={formData.age} onChange={handleInputChange} className="input w-full" min={16} max={40} required /></div>
            <div><label className="label" htmlFor="shirtNumber">Níº¡mero da Camisa</label><input type="number" id="shirtNumber" name="shirtNumber" value={formData.shirtNumber} onChange={handleInputChange} className="input w-full" min={1} max={99} required /></div>
          </div>
        </section>
        
        <section className="card">
          <h2 className="text-xl font-semibold text-dark-100 mb-6">Atributos (1-99)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(attributes).map(([attr, value]) => (
              <div key={attr}>
                <label className="label flex justify-between">
                  <span>{attr.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span className="text-primary-500 font-bold">{value}</span>
                </label>
                <input type="range" min="1" max="99" value={value} onChange={(e) => handleAttributeChange(attr, parseInt(e.target.value))} className="w-full" />
              </div>
            ))}
          </div>
        </section>
        
        <section className="card">
          <h2 className="text-xl font-semibold text-dark-100 mb-6">Caracterí¡¡sticas Especiais</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {(Object.keys(TRAIT_NAMES) as PlayerTrait[]).map(trait => (
              <button key={trait} type="button" onClick={() => handleTraitToggle(trait)} className={`p-3 rounded-lg text-sm font-medium transition-colors ${traits.includes(trait) ? 'bg-primary-600 text-white' : 'bg-dark-900 text-dark-300 hover:bg-dark-800'}`}>
                {TRAIT_NAMES[trait]}
              </button>
            ))}
          </div>
        </section>
        
        <section className="card">
          <h2 className="text-xl font-semibold text-dark-100 mb-6">Estatí¡¡sticas Calculadas</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatBox label="Overall" value={calculatedStats.overall.toString()} />
            <StatBox label="Valor de Mercado" value={`R$ ${(calculatedStats.marketValue / 1000000).toFixed(2)}M`} />
            <StatBox label="Salá¡¡rio" value={`R$ ${(calculatedStats.salary / 1000).toFixed(0)}k`} />
            <StatBox label="Estilo" value={calculatedStats.playingStyle} />
            <StatBox label="Consistê££ncia" value={`${calculatedStats.consistency}%`} />
            <StatBox label="Risco de Lesã££o" value={`${calculatedStats.injuryRisk}%`} />
          </div>
        </section>
        
        <div className="flex gap-4">
          <button type="submit" className="btn-primary"><Save className="w-5 h-5 mr-2" />Salvar Jogador</button>
        </div>
      </form>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 bg-dark-900 rounded-lg">
      <p className="text-sm text-dark-400 mb-1">{label}</p>
      <p className="text-xl font-bold text-dark-100">{value}</p>
    </div>
  );
}
