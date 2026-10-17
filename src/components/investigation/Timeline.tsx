import { Fragment, useState } from 'react';
import { LAST_CONNECTION } from '../../data/chats';
import { clueById, clues } from '../../data/clues';
import { fmtDate, fmtTime } from '../../lib/format';
import { useGame } from '../../state/GameContext';
import type { Certainty } from '../../types';
import { Icon } from '../Icons';
import { CERTAINTY_LABEL } from './CluesTab';

/** Pares de pistas descubiertas que se contradicen. */
export function useContradictions() {
  const { state } = useGame();
  const pairs: { a: string; b: string }[] = [];
  clues.forEach((c) => {
    if (!state.clues[c.id]) return;
    c.contradicts?.forEach((other) => {
      if (state.clues[other]) pairs.push({ a: c.id, b: other });
    });
  });
  return pairs;
}

export function Timeline() {
  const { state, openClue } = useGame();
  const [filter, setFilter] = useState<Certainty | 'todas'>('todas');
  const contradictions = useContradictions();
  const items = clues
    .filter((c) => state.clues[c.id] && c.date && (filter === 'todas' || c.certainty === filter))
    .sort((a, b) => a.date!.localeCompare(b.date!));
  const conflicted = new Set(contradictions.flatMap((p) => [p.a, p.b]));
  const firstAfter = items.find((c) => c.date! > LAST_CONNECTION);

  let prevDay = '';
  return (
    <div className="timeline-tab">
      <p className="muted small">
        Se construye con las pistas fechadas que vais encontrando. Distinguid <strong>hechos</strong> (los prueba el teléfono) de{' '}
        <strong>testimonios</strong> (lo que alguien cree o dice) e <strong>interpretaciones</strong>.
      </p>
      <div className="chips" role="group" aria-label="Filtrar por certeza">
        {(['todas', 'hecho', 'testimonio', 'interpretacion'] as const).map((k) => (
          <button key={k} className={`chip small ${filter === k ? 'on' : ''}`} onClick={() => setFilter(k)} aria-pressed={filter === k}>
            {k === 'todas' ? 'Todo' : CERTAINTY_LABEL[k]}
          </button>
        ))}
      </div>

      {contradictions.length > 0 && (
        <section className="contradictions" aria-label="Contradicciones detectadas">
          <h4>
            <Icon name="advertencia" size={16} /> Contradicciones detectadas ({contradictions.length})
          </h4>
          <ul>
            {contradictions.map(({ a, b }) => (
              <li key={`${a}-${b}`}>
                <button className="link-btn" onClick={() => openClue(a)}>
                  {clueById(a)?.title}
                </button>{' '}
                <span className="muted">choca con</span>{' '}
                <button className="link-btn" onClick={() => openClue(b)}>
                  {clueById(b)?.title}
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {items.length === 0 ? (
        <p className="empty">Aún no hay acontecimientos fechados.</p>
      ) : (
        <ol className="timeline">
          {items.map((c) => {
            const day = c.date!.slice(0, 10);
            const showDay = day !== prevDay;
            prevDay = day;
            return (
              <Fragment key={c.id}>
                {c === firstAfter && (
                  <li className="tl-marker" aria-label="Última conexión del teléfono">
                    <span>Última conexión del teléfono · 31 ene 21:47</span>
                  </li>
                )}
                <li className={`tl-item tl-${c.certainty} ${conflicted.has(c.id) ? 'conflict' : ''}`}>
                  {showDay && <span className="tl-day">{fmtDate(c.date!)}</span>}
                  <button className="tl-card" onClick={() => openClue(c.id)}>
                    <span className="tl-time">{fmtTime(c.date!) || '—'}</span>
                    <span className="tl-title">{c.title}</span>
                    <span className={`cert cert-${c.certainty}`}>{CERTAINTY_LABEL[c.certainty]}</span>
                    {conflicted.has(c.id) && <span className="conflict-tag">Contradicción</span>}
                  </button>
                </li>
              </Fragment>
            );
          })}
        </ol>
      )}
    </div>
  );
}
