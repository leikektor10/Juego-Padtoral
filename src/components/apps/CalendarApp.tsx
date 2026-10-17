import { useEffect, useMemo, useState } from 'react';
import { calendarEvents } from '../../data/records';
import { fmtLong, fmtMonthYear, parseIso } from '../../lib/format';
import { useGame } from '../../state/GameContext';
import type { CalendarEvent } from '../../types';
import { AppHeader } from './AppHeader';

const STATUS: Record<string, string> = { cancelado: 'Cancelado', hecho: 'Realizado', pendiente: 'Pendiente' };
const CAT: Record<CalendarEvent['category'], string> = { centro: 'Centro juvenil', familia: 'Familia', estudios: 'Estudios', personal: 'Personal' };

const MONTHS = [
  [2025, 9],
  [2025, 10],
  [2025, 11],
  [2026, 0],
  [2026, 1],
  [2026, 2],
  [2026, 3],
  [2026, 4],
  [2026, 5],
] as const;

export function CalendarApp() {
  const { nav, discover } = useGame();
  const [mode, setMode] = useState<'agenda' | 'mes'>('agenda');
  const [monthIdx, setMonthIdx] = useState(3);
  const [selected, setSelected] = useState<string | null>(null);
  const [day, setDay] = useState<string | null>(null);

  useEffect(() => {
    if (nav.app === 'calendario' && nav.target) {
      const ev = calendarEvents.find((e) => e.id === nav.target);
      if (ev) {
        setSelected(ev.id);
        setMode('agenda');
      }
    }
  }, [nav]);

  const ev = selected ? calendarEvents.find((e) => e.id === selected) : undefined;
  useEffect(() => {
    if (ev) discover([ev.clue]);
  }, [ev, discover]);

  const sorted = useMemo(() => [...calendarEvents].sort((a, b) => (a.date + (a.time ?? '')).localeCompare(b.date + (b.time ?? ''))), []);

  if (!ev && day) {
    const evs = calendarEvents.filter((e) => e.date === day);
    return (
      <div className="app">
        <AppHeader title={fmtLong(day)} onBack={() => setDay(null)} />
        <ul className="list">
          {evs.map((e) => (
            <li key={e.id}>
              <button className="list-item" onClick={() => setSelected(e.id)}>
                <span className={`cat-bar cat-${e.category}`} />
                <span className="li-main">
                  <span className={`li-title ${e.status === 'cancelado' ? 'struck' : ''}`}>{e.title}</span>
                  <span className="li-sub">{e.time ?? 'Todo el día'}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (ev) {
    return (
      <div className="app">
        <AppHeader title="Evento" onBack={() => setSelected(null)} />
        <div className="scroll pad event-detail">
          <span className={`cat-dot cat-${ev.category}`} />
          <h3 className={ev.status === 'cancelado' ? 'struck' : ''}>{ev.title}</h3>
          <p>
            {fmtLong(ev.date)}
            {ev.time ? ` · ${ev.time}` : ''}
          </p>
          <p className="muted">
            {CAT[ev.category]}
            {ev.status ? ` · ${STATUS[ev.status]}` : ''}
          </p>
          {ev.notes && <p className="event-notes">{ev.notes}</p>}
        </div>
      </div>
    );
  }

  const [y, m] = MONTHS[monthIdx];
  const first = new Date(y, m, 1);
  const offset = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const evByDay = (d: number) => {
    const key = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    return calendarEvents.filter((e) => e.date === key);
  };

  return (
    <div className="app">
      <AppHeader
        title="Calendario"
        right={
          <div className="seg small">
            <button className={mode === 'agenda' ? 'on' : ''} onClick={() => setMode('agenda')} aria-pressed={mode === 'agenda'}>
              Agenda
            </button>
            <button className={mode === 'mes' ? 'on' : ''} onClick={() => setMode('mes')} aria-pressed={mode === 'mes'}>
              Mes
            </button>
          </div>
        }
      />
      {mode === 'agenda' ? (
        <ul className="list scroll agenda">
          {sorted.map((e, i) => {
            const d = parseIso(e.date);
            const label = fmtMonthYear(d.getFullYear(), d.getMonth());
            const prev = sorted[i - 1];
            const showMonth = !prev || prev.date.slice(0, 7) !== e.date.slice(0, 7);
            return (
              <li key={e.id}>
                {showMonth && <h3 className="group-label">{label}</h3>}
                <button className="list-item" onClick={() => setSelected(e.id)}>
                  <span className="agenda-day">
                    <strong>{d.getDate()}</strong>
                    <span>{['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'][d.getDay()]}</span>
                  </span>
                  <span className={`cat-bar cat-${e.category}`} />
                  <span className="li-main">
                    <span className={`li-title ${e.status === 'cancelado' ? 'struck' : ''}`}>{e.title}</span>
                    <span className="li-sub">
                      {e.time ?? 'Todo el día'}
                      {e.status ? ` · ${STATUS[e.status]}` : ''}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="scroll pad">
          <div className="month-nav">
            <button className="icon-btn" disabled={monthIdx === 0} onClick={() => setMonthIdx((i) => i - 1)} aria-label="Mes anterior">
              ‹
            </button>
            <strong>{fmtMonthYear(y, m)}</strong>
            <button
              className="icon-btn"
              disabled={monthIdx === MONTHS.length - 1}
              onClick={() => setMonthIdx((i) => i + 1)}
              aria-label="Mes siguiente"
            >
              ›
            </button>
          </div>
          <div className="month-grid" role="grid">
            {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((d) => (
              <span key={d} className="mg-head">
                {d}
              </span>
            ))}
            {Array.from({ length: offset }, (_, i) => (
              <span key={`e${i}`} />
            ))}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const evs = evByDay(i + 1);
              const today = y === 2026 && m === 2 && i + 1 === 19;
              return (
                <button
                  key={i}
                  className={`mg-day ${evs.length ? 'has' : ''} ${today ? 'today' : ''}`}
                  disabled={!evs.length}
                  onClick={() => (evs.length === 1 ? setSelected(evs[0].id) : setDay(evs[0].date))}
                  aria-label={`${i + 1}${evs.length ? `: ${evs.map((e) => e.title).join(', ')}` : ''}`}
                >
                  {i + 1}
                  {evs.length > 0 && (
                    <span className="mg-dots">
                      {evs.map((e) => (
                        <i key={e.id} className={`cat-${e.category}`} />
                      ))}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <p className="muted small">Hoy: jueves 19 de marzo. Pulsa un día marcado para ver el evento.</p>
        </div>
      )}
    </div>
  );
}
