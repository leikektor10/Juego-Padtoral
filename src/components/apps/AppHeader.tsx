import type { ReactNode } from 'react';
import { useGame } from '../../state/GameContext';
import { Icon } from '../Icons';

/** Cabecera común: «atrás» vuelve al nivel anterior de la app o, si no hay, a la pantalla de inicio. */
export function AppHeader({ title, subtitle, onBack, right }: { title: ReactNode; subtitle?: ReactNode; onBack?: () => void; right?: ReactNode }) {
  const { openApp } = useGame();
  return (
    <header className="app-header">
      <button className="icon-btn" onClick={onBack ?? (() => openApp(null))} aria-label={onBack ? 'Atrás' : 'Volver a inicio'}>
        <Icon name="atras" />
      </button>
      <div className="app-title">
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      <div className="app-header-right">{right}</div>
    </header>
  );
}

export function Avatar({ color, initials, size = 'md' }: { color: string; initials: string; size?: 'sm' | 'md' | 'lg' }) {
  return (
    <span className={`avatar ${size}`} style={{ background: color }} aria-hidden="true">
      {initials}
    </span>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="empty">{children}</p>;
}
