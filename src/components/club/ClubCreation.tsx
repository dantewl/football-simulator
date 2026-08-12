import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { Shield, Upload, Palette, MapPin, Calendar, DollarSign, Target } from 'lucide-react';
import { Club } from '../../types';

export default function ClubCreation() {
  const navigate = useNavigate();
  const { setClub } = useStore();
  
  const [formData, setFormData] = useState({
    name: '', shortName: '', abbreviation: '', country: 'Brasil', city: '',
    foundedYear: new Date().getFullYear(), stadium: '', stadiumCapacity: 30000,
    budget: 10000000, primaryColor: '#FF6B35', secondaryColor: '#1E3A5F',
    accentColor: '#F7C548', philosophy: 'Futebol equilibrado', level: 50,
    seasonObjective: 'Manter-se na divisã££o',
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newClub: Club = {
      id: `club_${Date.now()}`,
      ...formData,
      crest: '',
      homeKit: { shirtColor: formData.primaryColor, shortsColor: formData.secondaryColor, socksColor: formData.primaryColor, pattern: 'solid' },
      awayKit: { shirtColor: '#FFFFFF', shortsColor: formData.secondaryColor, socksColor: '#FFFFFF', pattern: 'solid' },
      reputation: Math.round(formData.level * 0.8),
    };
    setClub(newClub);
    navigate('/');
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['foundedYear', 'stadiumCapacity', 'budget', 'level'].includes(name) ? (parseInt(value) || 0) : value,
    }));
  };
  
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-dark-100 mb-2">Criar Clube</h1>
        <p className="text-dark-400">Personalize seu clube de futebol</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <section className="card">
          <h2 className="text-xl font-semibold text-dark-100 mb-6 flex items-center gap-2"><Shield className="w-5 h-5 text-primary-500" />Informaç££es Básicas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className="label" htmlFor="name">Nome Completo</label><input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} className="input w-full" placeholder="Ex: Phoenix Football Club" required /></div>
            <div><label className="label" htmlFor="shortName">Nome Curto</label><input type="text" id="shortName" name="shortName" value={formData.shortName} onChange={handleInputChange} className="input w-full" placeholder="Ex: Phoenix FC" required /></div>
            <div><label className="label" htmlFor="abbreviation">Abreviaç££o (3 letras)</label><input type="text" id="abbreviation" name="abbreviation" value={formData.abbreviation} onChange={handleInputChange} className="input w-full" maxLength={3} required /></div>
            <div><label className="label" htmlFor="foundedYear">Ano de Fundaç££o</label><input type="number" id="foundedYear" name="foundedYear" value={formData.foundedYear} onChange={handleInputChange} className="input w-full" min={1850} max={new Date().getFullYear()} required /></div>
          </div>
        </section>
        
        <section className="card">
          <h2 className="text-xl font-semibold text-dark-100 mb-6 flex items-center gap-2"><MapPin className="w-5 h-5 text-primary-500" />Localizaç££o</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className="label" htmlFor="country">Paí¡¡s</label><select id="country" name="country" value={formData.country} onChange={handleInputChange} className="input w-full"><option value="Brasil">Brasil</option><option value="Portugal">Portugal</option><option value="Argentina">Argentina</option><option value="Espanha">Espanha</option><option value="Inglaterra">Inglaterra</option></select></div>
            <div><label className="label" htmlFor="city">Cidade</label><input type="text" id="city" name="city" value={formData.city} onChange={handleInputChange} className="input w-full" placeholder="Ex: Sã££o Paulo" required /></div>
          </div>
        </section>
        
        <section className="card">
          <h2 className="text-xl font-semibold text-dark-100 mb-6 flex items-center gap-2"><Calendar className="w-5 h-5 text-primary-500" />Está¡¡dio</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className="label" htmlFor="stadium">Nome do Estádio</label><input type="text" id="stadium" name="stadium" value={formData.stadium} onChange={handleInputChange} className="input w-full" placeholder="Ex: Arena Phoenix" required /></div>
            <div><label className="label" htmlFor="stadiumCapacity">Capacidade</label><input type="number" id="stadiumCapacity" name="stadiumCapacity" value={formData.stadiumCapacity} onChange={handleInputChange} className="input w-full" min={1000} max={200000} required /></div>
          </div>
        </section>
        
        <section className="card">
          <h2 className="text-xl font-semibold text-dark-100 mb-6 flex items-center gap-2"><Palette className="w-5 h-5 text-primary-500" />Cores</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div><label className="label">Cor Primá¡¡ria</label><input type="color" name="primaryColor" value={formData.primaryColor} onChange={handleInputChange} className="w-full h-10 rounded cursor-pointer" /></div>
            <div><label className="label">Cor Secundá¡¡ria</label><input type="color" name="secondaryColor" value={formData.secondaryColor} onChange={handleInputChange} className="w-full h-10 rounded cursor-pointer" /></div>
            <div><label className="label">Cor de Destaque</label><input type="color" name="accentColor" value={formData.accentColor} onChange={handleInputChange} className="w-full h-10 rounded cursor-pointer" /></div>
          </div>
        </section>
        
        <section className="card">
          <h2 className="text-xl font-semibold text-dark-100 mb-6 flex items-center gap-2"><DollarSign className="w-5 h-5 text-primary-500" />Orç££amento e Ní¡¡vel</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className="label" htmlFor="budget">Orç££amento Inicial (R$)</label><input type="number" id="budget" name="budget" value={formData.budget} onChange={handleInputChange} className="input w-full" min={1000000} max={1000000000} step={1000000} required /></div>
            <div><label className="label" htmlFor="level">Ní¡¡vel do Clube (1-100)</label><input type="number" id="level" name="level" value={formData.level} onChange={handleInputChange} className="input w-full" min={1} max={100} required /></div>
          </div>
        </section>
        
        <section className="card">
          <h2 className="text-xl font-semibold text-dark-100 mb-6 flex items-center gap-2"><Target className="w-5 h-5 text-primary-500" />Filosofia e Objetivos</h2>
          <div className="space-y-6">
            <div><label className="label" htmlFor="philosophy">Filosofia de Jogo</label><select id="philosophy" name="philosophy" value={formData.philosophy} onChange={handleInputChange} className="input w-full"><option value="Futebol equilibrado">Futebol equilibrado</option><option value="Futebol ofensivo com posse de bola">Futebol ofensivo</option><option value="Contra-ataques rápidos">Contra-ataques</option><option value="Defesa sólida">Defesa sólida</option></select></div>
            <div><label className="label" htmlFor="seasonObjective">Objetivo da Temporada</label><input type="text" id="seasonObjective" name="seasonObjective" value={formData.seasonObjective} onChange={handleInputChange} className="input w-full" placeholder="Ex: Classificaç££o para competiç££es continentais" required /></div>
          </div>
        </section>
        
        <div className="flex gap-4">
          <button type="submit" className="btn-primary">Criar Clube</button>
        </div>
      </form>
    </div>
  );
}
