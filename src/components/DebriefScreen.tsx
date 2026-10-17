import { useState } from 'react';
import { connectionPrompts, debriefQuestions, FINAL_PHRASE, FINAL_SUBPHRASE } from '../data/ending';
import { useGame } from '../state/GameContext';
import { Confirm } from './Modal';

type Step = { kind: 'intro' } | { kind: 'pregunta'; i: number } | { kind: 'conexion' } | { kind: 'final' };

export function DebriefScreen() {
  const { state, dispatch } = useGame();
  const [step, setStep] = useState<Step>({ kind: 'intro' });
  const [notes, setNotes] = useState(false);
  const [chosen, setChosen] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const next = () => {
    if (step.kind === 'intro') setStep({ kind: 'pregunta', i: 0 });
    else if (step.kind === 'pregunta') setStep(step.i < debriefQuestions.length - 1 ? { kind: 'pregunta', i: step.i + 1 } : { kind: 'conexion' });
    else if (step.kind === 'conexion') setStep({ kind: 'final' });
  };
  const prev = () => {
    if (step.kind === 'pregunta') setStep(step.i > 0 ? { kind: 'pregunta', i: step.i - 1 } : { kind: 'intro' });
    else if (step.kind === 'conexion') setStep({ kind: 'pregunta', i: debriefQuestions.length - 1 });
    else if (step.kind === 'final') setStep({ kind: 'conexion' });
  };

  return (
    <main className="debrief">
      <div className="debrief-inner">
        {step.kind === 'intro' && (
          <section className="db-step" key="intro">
            <h1 className="db-title">Ahora que conocemos su historia… ¿qué hacemos con ella?</h1>
            <p className="db-lead">
              Dejamos el teléfono. Marcos es un personaje inventado, pero las preguntas no. Vamos a conversar sin prisa, una pregunta cada vez.
              Nadie tiene que contar nada personal si no quiere.
            </p>
            <div className="row-center">
              <button className="btn btn-dark" onClick={next} autoFocus>
                Empezar
              </button>
              <button className="btn btn-ghost-dark" onClick={() => dispatch({ type: 'setPhase', phase: 'final' })}>
                Volver a la reconstrucción
              </button>
            </div>
          </section>
        )}

        {step.kind === 'pregunta' && (
          <section className="db-step" key={`q${step.i}`} aria-live="polite">
            <p className="db-count">
              Pregunta {step.i + 1} de {debriefQuestions.length}
            </p>
            <div className="db-progress" aria-hidden="true">
              {debriefQuestions.map((_, i) => (
                <span key={i} className={i <= step.i ? 'on' : ''} />
              ))}
            </div>
            <h2 className="db-question">{debriefQuestions[step.i]}</h2>
            <div className="row-center">
              <button className="btn btn-ghost-dark" onClick={prev}>
                Anterior
              </button>
              <button className="btn btn-dark" onClick={next} autoFocus>
                {step.i < debriefQuestions.length - 1 ? 'Siguiente pregunta' : 'Ir a la dinámica final'}
              </button>
            </div>
            <div className="db-notes">
              <button className="link-btn" onClick={() => setNotes((v) => !v)} aria-expanded={notes}>
                {notes ? 'Ocultar notas de quien facilita' : 'Notas de quien facilita'}
              </button>
              {notes && (
                <textarea
                  className="input light"
                  rows={4}
                  value={state.facilitatorNotes}
                  onChange={(e) => dispatch({ type: 'facilitatorNotes', text: e.target.value })}
                  placeholder="Ideas que surgen en el grupo (se guardan solo en este dispositivo)."
                  aria-label="Notas de quien facilita"
                />
              )}
            </div>
          </section>
        )}

        {step.kind === 'conexion' && (
          <section className="db-step" key="conexion">
            <p className="db-count">Dinámica final</p>
            <h2 className="db-title">Una conexión real</h2>
            <p className="db-lead">
              Cada persona puede completar, si quiere, una de estas frases. Es voluntario y personal: escribidla en un papel o en vuestro propio móvil.
              Si la escribís aquí, se queda solo en este dispositivo y podéis borrarla.
            </p>
            <div className="cx-options" role="radiogroup" aria-label="Elige una frase">
              {connectionPrompts.map((p) => (
                <label key={p.id} className={`cx-option ${chosen === p.id ? 'on' : ''}`}>
                  <input type="radio" name="cx" checked={chosen === p.id} onChange={() => setChosen(p.id)} />
                  <span>{p.text}</span>
                </label>
              ))}
            </div>
            {chosen && (
              <textarea
                className="input light"
                rows={3}
                value={state.connection[chosen] ?? ''}
                onChange={(e) => dispatch({ type: 'connection', id: chosen, text: e.target.value })}
                placeholder="Completa la frase (opcional)…"
                aria-label={connectionPrompts.find((p) => p.id === chosen)?.text}
              />
            )}
            {Object.values(state.connection).some((v) => v.trim()) && (
              <button className="link-btn" onClick={() => dispatch({ type: 'clearConnection' })}>
                Borrar lo escrito en esta dinámica
              </button>
            )}
            <div className="row-center">
              <button className="btn btn-ghost-dark" onClick={prev}>
                Anterior
              </button>
              <button className="btn btn-dark" onClick={next}>
                Terminar
              </button>
            </div>
          </section>
        )}

        {step.kind === 'final' && (
          <section className="db-step db-final" key="final">
            <p className="final-phrase">{FINAL_PHRASE}</p>
            <p className="final-sub">{FINAL_SUBPHRASE}</p>
            <div className="row-center">
              <button className="btn btn-ghost-dark" onClick={prev}>
                Anterior
              </button>
              <button className="btn btn-ghost-dark" onClick={() => dispatch({ type: 'setPhase', phase: 'titulo' })}>
                Volver a la portada
              </button>
              <button className="btn btn-dark" onClick={() => setConfirmReset(true)}>
                Preparar para otro grupo
              </button>
            </div>
          </section>
        )}
      </div>
      {confirmReset && (
        <Confirm
          title="Preparar para otro grupo"
          text="Se borrará toda la partida de este dispositivo (pistas, tablero, hipótesis, notas y respuestas de la dinámica). ¿Continuar?"
          confirmLabel="Borrar y volver a empezar"
          danger
          onCancel={() => setConfirmReset(false)}
          onConfirm={() => dispatch({ type: 'reset' })}
        />
      )}
    </main>
  );
}
