import { DebriefScreen } from './components/DebriefScreen';
import { EndingScreen } from './components/EndingScreen';
import { GameLayout } from './components/GameLayout';
import { CaseBrief, ContentWarning, TitleScreen } from './components/Screens';
import { useGame } from './state/GameContext';

export function App() {
  const { state } = useGame();
  switch (state.phase) {
    case 'titulo':
      return <TitleScreen />;
    case 'aviso':
      return <ContentWarning />;
    case 'encargo':
      return <CaseBrief />;
    case 'final':
      return <EndingScreen />;
    case 'reflexion':
      return <DebriefScreen />;
    default:
      return <GameLayout />;
  }
}
