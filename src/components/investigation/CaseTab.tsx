import { useState } from 'react';
import { chapterById, chapters } from '../../data/chapters';
import { clueById } from '../../data/clues';
import { chapterSolved } from '../../state/game';
import { useGame } from '../../state/GameContext';
import type { ChapterQuestion } from '../../types';
import { Icon } from '../Icons';

export function CaseTab() {
  const { state, dispatch } = useGame();
  const ch = chapterById(state.chapter);
  const done = chapters.filter((c) => state.completed.includes(c.id) && c.id !== state.chapter);
  const finished = chapterSolved(state, 5);

  return (
    <div className="case-tab">
      {!state.unlocked ? (
        <section className="card">
          <p className="eyebrow">Capítulo 1 · {ch.title}</p>
          <h3>Primer paso: desbloquear el teléfono</h3>
          <p>El teléfono pide un PIN de cuatro cifras. Dentro de la funda había un papel doblado:</p>
          <p className="handwritten inline-note">PIN: el cumple de la enana 🙃</p>
          <p className="muted small">Pista: en la pantalla de bloqueo podéis ver el fondo de pantalla.</p>
        </section>
      ) : (
        <>
          <section className="card chapter-card">
            <p className="eyebrow">
              Capítulo {ch.id} de 5 · {ch.title}
            </p>
            <h3>Objetivo</h3>
            <p>{ch.objective}</p>
          </section>
          {ch.questions.map((q) => (
            <Question key={q.id} q={q} />
          ))}
          {finished && (
            <section className="card final-call">
              <h3>Reconstrucción lista</h3>
              <p>Habéis ordenado los hechos y elegido una explicación. Cuando el grupo esté de acuerdo, presentad la reconstrucción final.</p>
              <button className="btn btn-primary" onClick={() => dispatch({ type: 'finish' })}>
                Presentar reconstrucción final
              </button>
            </section>
          )}
        </>
      )}

      {done.length > 0 && (
        <section className="done-chapters">
          <h3 className="group-label">Capítulos resueltos</h3>
          {done.reverse().map((c) => (
            <details key={c.id} className="card done">
              <summary>
                <Icon name="check" size={16} /> {c.id}. {c.title}
              </summary>
              <p className="muted">{c.outro}</p>
              <ul className="answered">
                {c.questions.map((q) => {
                  const a = state.answers[q.id];
                  if (!a) return null;
                  const label =
                    q.type === 'eleccion' ? q.options?.find((o) => o.id === a.value)?.label : q.type === 'texto' ? String(a.value) : 'Orden correcto';
                  return (
                    <li key={q.id}>
                      <strong>{q.prompt}</strong>
                      <span>{label}</span>
                    </li>
                  );
                })}
              </ul>
            </details>
          ))}
        </section>
      )}
    </div>
  );
}

function SupportChips({ ids }: { ids?: string[] }) {
  const { state, openClue } = useGame();
  const found = (ids ?? []).filter((id) => state.clues[id]);
  if (!found.length) return null;
  return (
    <div className="support">
      <span className="muted small">Lo sostienen:</span>
      {found.map((id) => (
        <button key={id} className="chip small" onClick={() => openClue(id)}>
          {clueById(id)?.title}
        </button>
      ))}
    </div>
  );
}

function Question({ q }: { q: ChapterQuestion }) {
  const { state, dispatch, sound } = useGame();
  const prev = state.answers[q.id];
  const [choice, setChoice] = useState<string>(typeof prev?.value === 'string' && q.type === 'eleccion' ? prev.value : '');
  const [text, setText] = useState<string>(q.type === 'texto' && typeof prev?.value === 'string' ? prev.value : '');
  const [order, setOrder] = useState<string[]>(() =>
    q.type === 'orden' ? (Array.isArray(prev?.value) ? (prev!.value as string[]) : shuffled(q.options!.map((o) => o.id), q.id)) : [],
  );
  const [feedback, setFeedback] = useState<'ok' | 'ko' | null>(prev?.correct ? 'ok' : null);
  const solved = !!prev?.correct;

  const check = () => {
    if (q.type === 'eleccion') {
      if (!choice) return;
      const ok = choice === q.correct;
      dispatch({ type: 'answer', questionId: q.id, value: choice, correct: ok });
      setFeedback(ok ? 'ok' : 'ko');
      sound(ok ? 'chapter' : 'error');
    } else if (q.type === 'orden') {
      const correct = q.correct as string[];
      const ok = order.every((id, i) => id === correct[i]);
      dispatch({ type: 'answer', questionId: q.id, value: order, correct: ok });
      setFeedback(ok ? 'ok' : 'ko');
      sound(ok ? 'chapter' : 'error');
    }
  };

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= order.length) return;
    const next = [...order];
    [next[i], next[j]] = [next[j], next[i]];
    setOrder(next);
    setFeedback(null);
  };

  if (q.type === 'texto') {
    return (
      <section className="card question open">
        <p className="q-label">
          <span className="tag">Para conversar</span>
        </p>
        <label className="q-prompt" htmlFor={`q-${q.id}`}>
          {q.prompt}
        </label>
        <textarea
          id={`q-${q.id}`}
          className="input"
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={() => text.trim() && text !== prev?.value && dispatch({ type: 'answer', questionId: q.id, value: text })}
          placeholder="Escribid aquí lo que piensa el grupo (opcional, no se corrige)."
        />
      </section>
    );
  }

  const correctCount = q.type === 'orden' && feedback === 'ko' ? order.filter((id, i) => id === (q.correct as string[])[i]).length : 0;

  return (
    <section className={`card question ${solved ? 'solved' : ''}`}>
      <p className="q-label">
        <span className="tag">{solved ? 'Resuelta' : 'Deducción'}</span>
      </p>
      <p className="q-prompt" id={`q-${q.id}`}>
        {q.prompt}
      </p>
      {q.type === 'eleccion' && (
        <div className="options" role="radiogroup" aria-labelledby={`q-${q.id}`}>
          {q.options!.map((o) => (
            <label key={o.id} className={`option ${choice === o.id ? 'on' : ''} ${solved && o.id === q.correct ? 'correct' : ''}`}>
              <input
                type="radio"
                name={q.id}
                value={o.id}
                checked={choice === o.id}
                disabled={solved}
                onChange={() => {
                  setChoice(o.id);
                  setFeedback(null);
                }}
              />
              <span>{o.label}</span>
            </label>
          ))}
        </div>
      )}
      {q.type === 'orden' && (
        <ol className="order-list">
          {order.map((id, i) => (
            <li key={id}>
              <span className="order-n">{i + 1}</span>
              <span className="order-label">{q.options!.find((o) => o.id === id)!.label}</span>
              {!solved && (
                <span className="order-btns">
                  <button className="icon-btn small" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Subir">
                    ▲
                  </button>
                  <button className="icon-btn small" onClick={() => move(i, 1)} disabled={i === order.length - 1} aria-label="Bajar">
                    ▼
                  </button>
                </span>
              )}
            </li>
          ))}
        </ol>
      )}
      {!solved && (
        <button className="btn btn-primary btn-small" onClick={check} disabled={q.type === 'eleccion' && !choice}>
          Comprobar
        </button>
      )}
      <div aria-live="polite">
        {feedback === 'ok' && <p className="feedback ok">✓ {q.okFeedback}</p>}
        {feedback === 'ko' && (
          <p className="feedback ko">
            {q.type === 'orden' ? `${correctCount} de ${order.length} en su sitio. ` : 'Todavía no. '}
            {q.koFeedback}
          </p>
        )}
      </div>
      {solved && <SupportChips ids={q.support} />}
    </section>
  );
}

/** Orden inicial desordenado pero estable para cada pregunta. */
function shuffled(ids: string[], seed: string) {
  let h = 0;
  for (const c of seed) h = (h * 33 + c.charCodeAt(0)) >>> 0;
  const a = [...ids];
  for (let i = a.length - 1; i > 0; i--) {
    h = (h * 1664525 + 1013904223) >>> 0;
    const j = h % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
