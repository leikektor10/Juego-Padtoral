import { useEffect, useState, type ReactNode } from 'react';
import { PHONE_NOW } from '../data/meta';
import { syncPercent } from '../state/game';
import { useGame } from '../state/GameContext';
import type { AppId } from '../types';
import { AudioApp } from './apps/AudioApp';
import { BrowserApp } from './apps/BrowserApp';
import { CalendarApp } from './apps/CalendarApp';
import { CallsApp } from './apps/CallsApp';
import { ContactsApp } from './apps/ContactsApp';
import { FilesApp } from './apps/FilesApp';
import { GalleryApp } from './apps/GalleryApp';
import { MapsApp } from './apps/MapsApp';
import { MessagesApp } from './apps/MessagesApp';
import { NotesApp } from './apps/NotesApp';
import { SearchApp } from './apps/SearchApp';
import { SettingsApp } from './apps/SettingsApp';
import { HomeScreen } from './HomeScreen';
import { Icon } from './Icons';
import { LockScreen } from './LockScreen';

const APPS: Record<AppId, () => ReactNode> = {
  mensajes: () => <MessagesApp />,
  galeria: () => <GalleryApp />,
  notas: () => <NotesApp />,
  grabadora: () => <AudioApp />,
  llamadas: () => <CallsApp />,
  calendario: () => <CalendarApp />,
  archivos: () => <FilesApp />,
  contactos: () => <ContactsApp />,
  buscar: () => <SearchApp />,
  mapas: () => <MapsApp />,
  navegador: () => <BrowserApp />,
  ajustes: () => <SettingsApp />,
};

/** Minutos transcurridos desde que se abrió la sesión: el reloj del teléfono avanza de verdad. */
function useClock() {
  const [start] = useState(() => Date.now());
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 15000);
    return () => window.clearInterval(t);
  }, []);
  const minutes = Math.floor((now - start) / 60000);
  const total = PHONE_NOW.startMinutes + minutes;
  const hh = String(Math.floor(total / 60) % 24).padStart(2, '0');
  const mm = String(total % 60).padStart(2, '0');
  return { time: `${hh}:${mm}`, battery: Math.min(100, 14 + minutes) };
}

export function StatusBar({ time, battery }: { time: string; battery: number }) {
  const { state } = useGame();
  const sync = syncPercent(state);
  return (
    <div className="status-bar" aria-label={`Hora ${time}. Batería ${battery} por ciento, cargando.`}>
      <span className="sb-time">{time}</span>
      <span className="sb-right">
        {sync < 100 && (
          <span className="sb-sync" title="Sincronizando mensajes pendientes">
            <Icon name="sync" size={13} /> {sync}%
          </span>
        )}
        <Icon name="wifi" size={15} />
        <span className="sb-batt">
          <span className="batt-shell">
            <span className="batt-fill" style={{ width: `${battery}%` }} />
          </span>
          <span className="batt-bolt" aria-hidden="true">
            ⚡
          </span>
        </span>
      </span>
    </div>
  );
}

export function PhoneShell() {
  const { state, nav, openApp } = useGame();
  const clock = useClock();
  const [booting, setBooting] = useState(!state.unlocked);

  useEffect(() => {
    if (!booting) return;
    const t = window.setTimeout(() => setBooting(false), state.settings.reduceMotion ? 300 : 2200);
    return () => window.clearTimeout(t);
  }, [booting, state.settings.reduceMotion]);

  let content: ReactNode;
  if (booting) {
    content = (
      <div className="boot" role="status">
        <div className="boot-logo" aria-hidden="true" />
        <p>Batería 14 % · Conectado a la corriente</p>
        <p className="boot-sub">Conectando a «CJ_DomingoSavio_Invitados»…</p>
      </div>
    );
  } else if (!state.unlocked) {
    content = <LockScreen time={clock.time} />;
  } else if (nav.app) {
    content = (
      <div className="app-host" key={nav.app}>
        {APPS[nav.app]()}
      </div>
    );
  } else {
    content = <HomeScreen />;
  }

  return (
    <div className="phone" aria-label="Teléfono de Marcos">
      <div className="phone-screen">
        {!booting && <StatusBar time={clock.time} battery={clock.battery} />}
        <div className="phone-content">{content}</div>
        {state.unlocked && !booting && (
          <button className="home-indicator" onClick={() => openApp(null)} aria-label="Ir a la pantalla de inicio">
            <span />
          </button>
        )}
      </div>
    </div>
  );
}
