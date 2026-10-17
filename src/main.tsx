import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { GameProvider } from './state/GameContext';
import './styles/base.css';
import './styles/phone.css';
import './styles/apps.css';
import './styles/panel.css';
import './styles/screens.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GameProvider>
      <App />
    </GameProvider>
  </StrictMode>,
);
