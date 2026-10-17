import { hypothesisQuestions } from '../../data/chapters';
import { useGame } from '../../state/GameContext';

const fmtStamp = (ms: number) => new Date(ms).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

export function HypothesisJournal() {
  const { state, dispatch } = useGame();
  const total = Object.keys(state.clues).length;

  return (
    <div className="hypo-tab">
      <p className="muted small">
        Escribid vuestras hipótesis y guardad una versión cada vez que el grupo cambie de idea. Equivocarse y corregir es parte de investigar.
      </p>
      {hypothesisQuestions.map((h) => {
        const entry = state.hypotheses[h.id];
        const last = entry?.history[entry.history.length - 1];
        const newClues = last ? total - last.clueCount : 0;
        const dirty = !!entry?.current.trim() && entry.current !== last?.text;
        return (
          <section key={h.id} className="card hypo">
            <label htmlFor={`h-${h.id}`} className="q-prompt">
              {h.q}
            </label>
            {last && newClues > 0 && (
              <p className="hypo-new">
                {newClues} {newClues === 1 ? 'pista nueva' : 'pistas nuevas'} desde vuestra última versión. ¿Sigue valiendo?
              </p>
            )}
            <textarea
              id={`h-${h.id}`}
              className="input"
              rows={3}
              value={entry?.current ?? ''}
              onChange={(e) => dispatch({ type: 'hypothesisDraft', id: h.id, text: e.target.value })}
              placeholder="Nuestra hipótesis es…"
            />
            <div className="row-between">
              <span className="muted small">
                {last ? `Versión ${entry!.history.length} · ${fmtStamp(last.at)}` : 'Sin versiones guardadas'}
                {dirty ? ' · cambios sin guardar' : ''}
              </span>
              <button className="btn btn-small" disabled={!dirty} onClick={() => dispatch({ type: 'hypothesisSave', id: h.id })}>
                Guardar versión
              </button>
            </div>
            {entry && entry.history.length > 1 && (
              <details className="history">
                <summary>Versiones anteriores ({entry.history.length - 1})</summary>
                <ol>
                  {entry.history
                    .slice(0, -1)
                    .reverse()
                    .map((v) => (
                      <li key={v.at}>
                        <span className="muted small">
                          {fmtStamp(v.at)} · con {v.clueCount} pistas
                        </span>
                        <p>{v.text}</p>
                      </li>
                    ))}
                </ol>
              </details>
            )}
          </section>
        );
      })}
    </div>
  );
}
