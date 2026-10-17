import { chapterById, LOCK_HINTS } from '../../data/chapters';
import { useGame } from '../../state/GameContext';

const LEVELS = [
  { name: 'Observación', desc: 'Señala un detalle que puede pasar inadvertido.' },
  { name: 'Relación', desc: 'Sugiere revisar otra prueba relacionada.' },
  { name: 'Orientación', desc: 'Indica qué parte de la cronología o de las conversaciones revisar.' },
];

export function HintSystem() {
  const { state, dispatch } = useGame();
  const key = state.unlocked ? String(state.chapter) : 'lock';
  const hints = state.unlocked ? chapterById(state.chapter).hints : LOCK_HINTS;
  const level = state.hints[key] ?? 0;
  const title = state.unlocked ? `Capítulo ${state.chapter} · ${chapterById(state.chapter).title}` : 'Desbloquear el teléfono';

  return (
    <div className="hints-tab">
      <p className="muted small">
        Ayudas para <strong>{title}</strong>. Se abren de una en una y no dan la solución. Usadlas si el grupo lleva un rato atascado.
      </p>
      <ol className="hint-list">
        {hints.map((h, i) => (
          <li key={i} className={`card hint ${i < level ? 'open' : ''}`}>
            <p className="eyebrow">
              Nivel {i + 1} · {LEVELS[i].name}
            </p>
            {i < level ? <p>{h}</p> : <p className="muted small">{LEVELS[i].desc}</p>}
            {i === level && (
              <button className="btn btn-small" onClick={() => dispatch({ type: 'revealHint', key })}>
                Ver ayuda de nivel {i + 1}
              </button>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
