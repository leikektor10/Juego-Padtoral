import { useEffect, useState } from 'react';
import { hypothesisQuestions } from '../data/chapters';
import { clues } from '../data/clues';
import { endingSummary, epilogue } from '../data/ending';
import { useGame } from '../state/GameContext';

export function EndingScreen() {
  const { state, dispatch } = useGame();
  const [step, setStep] = useState<'resumen' | 'epilogo'>('resumen');
  const [lines, setLines] = useState(1);
  const found = clues.filter((c) => state.clues[c.id]).length;
  const hintsUsed = Object.values(state.hints).reduce((a, b) => a + b, 0);
  const minutes = state.startedAt && state.finishedAt ? Math.max(1, Math.round((state.finishedAt - state.startedAt) / 60000)) : null;

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [step]);

  if (step === 'epilogo') {
    const done = lines >= epilogue.dialogo.length;
    return (
      <main className="ending epilogue">
        <article className="ending-inner">
          <p className="eyebrow">{epilogue.fecha}</p>
          <h1>{epilogue.titulo}</h1>
          <p className="lead">{epilogue.intro}</p>
          <ol className="call-transcript" aria-live="polite">
            {epilogue.dialogo.slice(0, lines).map((l, i) => (
              <li key={i} className={l.quien === 'Marcos' ? 'marcos' : 'nacho'}>
                <span className="who">{l.quien}</span>
                <span className="what">{l.texto}</span>
              </li>
            ))}
          </ol>
          {!done ? (
            <div className="row-center">
              <button className="btn btn-primary" onClick={() => setLines((n) => n + 1)} autoFocus>
                Seguir escuchando
              </button>
              <button className="btn btn-ghost" onClick={() => setLines(epilogue.dialogo.length)}>
                Mostrar toda la llamada
              </button>
            </div>
          ) : (
            <>
              <p className="closing">{epilogue.cierre}</p>
              <div className="row-center">
                <button className="btn btn-primary" onClick={() => dispatch({ type: 'setPhase', phase: 'reflexion' })} autoFocus>
                  Dejar el teléfono y conversar
                </button>
              </div>
            </>
          )}
        </article>
      </main>
    );
  }

  return (
    <main className="ending">
      <article className="ending-inner">
        <p className="eyebrow">Reconstrucción final</p>
        <h1>Lo que pasó con Marcos</h1>
        <p className="lead">
          Marcos no desapareció de golpe ni por una sola razón. Esto es lo que habéis podido reconstruir, lo que pasó inadvertido y lo que no se
          puede saber.
        </p>
        <p className="stats muted small">
          {found} pistas encontradas de {clues.length} · {hintsUsed} ayudas usadas{minutes ? ` · ${minutes} minutos de investigación` : ''}
        </p>

        <section>
          <h2>Lo que se ha podido comprobar</h2>
          <ul className="ending-list">
            {endingSummary.comprobado.map((c, i) => (
              <li key={i}>
                {c.text}
                <span className="evidence-count">
                  {c.clues.filter((id) => state.clues[id]).length}/{c.clues.length} pruebas encontradas
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2>Señales que pasaron inadvertidas</h2>
          <ul className="signals">
            {endingSummary.senales.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2>Hipótesis que tuvieron que corregirse</h2>
          <div className="corrections">
            {endingSummary.hipotesisCorregidas.map((h) => (
              <div key={h.antes} className="correction">
                <p className="before">{h.antes}</p>
                <p className="after">{h.despues}</p>
              </div>
            ))}
          </div>
        </section>

        {Object.values(state.hypotheses).some((h) => h.current.trim()) && (
          <section>
            <h2>Vuestras hipótesis</h2>
            <dl className="your-hypos">
              {hypothesisQuestions.map((q) => {
                const h = state.hypotheses[q.id];
                if (!h?.current.trim()) return null;
                return (
                  <div key={q.id}>
                    <dt>{q.q}</dt>
                    <dd>
                      {h.current}
                      {h.history.length > 1 && <span className="muted small"> ({h.history.length} versiones)</span>}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </section>
        )}

        <section>
          <h2>Preguntas que siguen sin respuesta</h2>
          <ul className="open-questions">
            {endingSummary.sinRespuesta.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2>Momentos en los que alguien podía acompañar</h2>
          <p className="muted">No para buscar culpables: para aprender a ver.</p>
          <ol className="moments">
            {endingSummary.momentos.map((m) => (
              <li key={m.fecha + m.quien}>
                <span className="m-date">{m.fecha}</span>
                <span className="m-who">{m.quien}</span>
                <span className="m-text">{m.texto}</span>
              </li>
            ))}
          </ol>
        </section>

        <div className="row-center">
          <button className="btn btn-primary" onClick={() => setStep('epilogo')}>
            Epílogo: la llamada
          </button>
          <button className="btn btn-ghost" onClick={() => dispatch({ type: 'setPhase', phase: 'juego' })}>
            Volver al teléfono
          </button>
        </div>
      </article>
    </main>
  );
}
