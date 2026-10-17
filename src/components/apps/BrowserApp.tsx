import { useEffect, useRef } from 'react';
import { browserHistory } from '../../data/records';
import { fmtDate, fmtTime } from '../../lib/format';
import { useDiscoverOnView, useGame } from '../../state/GameContext';
import type { BrowserEntry } from '../../types';
import { Icon } from '../Icons';
import { AppHeader } from './AppHeader';

function Row({ b, highlight }: { b: BrowserEntry; highlight: boolean }) {
  const ref = useDiscoverOnView<HTMLLIElement>(b.clue);
  return (
    <li ref={ref} data-b={b.id} className={`browser-row ${highlight ? 'flash' : ''}`}>
      <Icon name="buscar" size={16} />
      <span className="li-main">
        <span className="li-title">{b.query}</span>
        {b.visited && <span className="li-sub">{b.visited}</span>}
      </span>
      <span className="li-meta">{fmtTime(b.at)}</span>
    </li>
  );
}

export function BrowserApp() {
  const { nav } = useGame();
  const list = [...browserHistory].sort((a, b) => b.at.localeCompare(a.at));
  const target = nav.app === 'navegador' ? nav.target : undefined;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (target) ref.current?.querySelector(`[data-b="${target}"]`)?.scrollIntoView({ block: 'center' });
  }, [target, nav.nonce]);

  const days: { day: string; items: BrowserEntry[] }[] = [];
  list.forEach((b) => {
    const day = b.at.slice(0, 10);
    const last = days[days.length - 1];
    if (last?.day === day) last.items.push(b);
    else days.push({ day, items: [b] });
  });

  return (
    <div className="app">
      <AppHeader title="Navegador" subtitle="Historial" />
      <div className="scroll" ref={ref}>
        {days.map((g) => (
          <section key={g.day}>
            <h3 className="group-label">{fmtDate(g.day)}</h3>
            <ul className="list">
              {g.items.map((b) => (
                <Row key={b.id} b={b} highlight={target === b.id} />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
