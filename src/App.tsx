import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';
import { demoClub, demoPlayers, demoSeason, demoCompetition, generateDemoMatches } from './data/demoData';
import Layout from './components/Layout';
import Dashboard from './components/dashboard/Dashboard';
import ClubCreation from './components/club/ClubCreation';
import Squad from './components/player/Squad';
import PlayerCreator from './components/player/PlayerCreator';
import MatchSimulation from './components/match/MatchSimulation';
import SeasonSimulation from './components/season/SeasonSimulation';
import Settings from './components/Settings';

function App() {
  const { club, players, setClub, addPlayer, setCompetitions, setCurrentSeason, addMatch } = useStore();
  
  if (!club && players.length === 0) {
    setClub(demoClub);
    demoPlayers.forEach(player => addPlayer(player));
    setCompetitions([demoCompetition]);
    setCurrentSeason(demoSeason);
    generateDemoMatches().forEach(match => addMatch(match));
  }
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={club ? <Dashboard /> : <Navigate to="/club/create" />} />
          <Route path="club/create" element={<ClubCreation />} />
          <Route path="squad" element={<Squad />} />
          <Route path="player/create" element={<PlayerCreator />} />
          <Route path="match/:matchId" element={<MatchSimulation />} />
          <Route path="season" element={<SeasonSimulation />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
