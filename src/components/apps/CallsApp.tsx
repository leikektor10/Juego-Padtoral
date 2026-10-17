import { useEffect, useRef } from 'react';
import { contactById } from '../../data/contacts';
import { calls } from '../../data/records';
import { fmtCallDuration, fmtDateTime } from '../../lib/format';
import { useDiscoverOnView, useGame } from '../../state/GameContext';
import type { CallEntry } from '../../types';
import { Icon } from '../Icons';
import { AppHeader, Avatar } from './AppHeader';

const LABEL: Record<CallEntry['direction'], string> = {
  entrante: 'Entrante',
  saliente: 'Saliente',
  perdida: 'Perdida',
  rechazada: 'Rechazada',
};

function CallRow({ c, highlight }: { c: CallEntry; highlight: boolean }) {
  const ref = useDiscoverOnView<HTMLLIElement>(c.clue);
  const contact = contactById(c.who);
  return (
    <li ref={ref} className={`call-row ${highlight ? 'flash' : ''}`} data-call={c.id}>
      <Avatar color={contact?.color ?? '#555'} initials={contact?.initials ?? '#'} size="sm" />
      <span className="li-main">
        <span className={`li-title ${c.direction === 'perdida' || c.direction === 'rechazada' ? 'missed' : ''}`}>{contact?.name ?? c.who}</span>
        <span className="li-sub">
          <span className={`call-dir ${c.direction}`}>{c.direction === 'saliente' ? '↗' : '↙'}</span> {LABEL[c.direction]}
          {c.duration ? ` · ${fmtCallDuration(c.duration)}` : ''}
        </span>
      </span>
      <span className="li-meta">{fmtDateTime(c.at, false)}</span>
    </li>
  );
}

export function CallsApp() {
  const { state, nav, openApp } = useGame();
  const list = [...calls].sort((a, b) => b.at.localeCompare(a.at));
  const target = nav.app === 'llamadas' ? nav.target : undefined;
  const scroller = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!target) return;
    scroller.current?.querySelector(`[data-call="${target}"]`)?.scrollIntoView({ block: 'center' });
  }, [target, nav.nonce]);

  return (
    <div className="app">
      <AppHeader title="Teléfono" subtitle="Historial de llamadas" />
      {state.chapter >= 4 && (
        <button className="notice-row" onClick={() => openApp('mensajes', 'operador#o01')}>
          <Icon name="advertencia" size={16} />
          <span>Llamadas recibidas con el teléfono apagado: ver aviso del operador (SMS)</span>
        </button>
      )}
      <p className="notice muted small">Con el teléfono apagado (desde el 1 de febrero) no se registran llamadas en este historial.</p>
      <ul className="list calls" ref={scroller}>
        {list.map((c) => (
          <CallRow key={c.id} c={c} highlight={target === c.id} />
        ))}
      </ul>
    </div>
  );
}
