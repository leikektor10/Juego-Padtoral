import { clueById } from '../../data/clues';
import { displayName } from '../../data/contacts';
import { fmtDateTime } from '../../lib/format';
import { useGame } from '../../state/GameContext';
import { Icon } from '../Icons';
import { Modal } from '../Modal';
import { CERTAINTY_LABEL, KIND_LABEL } from './CluesTab';

const CERT_HELP = {
  hecho: 'Lo prueba el propio dispositivo (una fecha, un registro, una foto, un texto escrito por Marcos).',
  testimonio: 'Es lo que alguien dice o cree. Puede ser cierto, incompleto o equivocado.',
  interpretacion: 'Es una lectura posible de una prueba. Hay que contrastarla.',
};

/** Detalle de una pista: qué dice, de dónde sale, con qué choca y acceso a la prueba original. */
export function EvidenceDrawer() {
  const { state, drawerClue, openClue, openApp, dispatch } = useGame();
  if (!drawerClue) return null;
  const c = clueById(drawerClue);
  if (!c) return null;
  const onBoard = state.board.nodes.some((n) => n.clueId === c.id);
  const contradictions = [
    ...(c.contradicts ?? []),
    ...Object.keys(state.clues).filter((id) => clueById(id)?.contradicts?.includes(c.id)),
  ].filter((id) => state.clues[id]);

  return (
    <Modal title={c.title} onClose={() => openClue(null)}>
      <div className="evidence">
        <p className="ev-meta">
          <span className={`cert cert-${c.certainty}`}>{CERTAINTY_LABEL[c.certainty]}</span>
          <span className="tag">{KIND_LABEL[c.kind]}</span>
          {c.date && <span>{fmtDateTime(c.date)}</span>}
        </p>
        <p className="ev-detail">{c.detail}</p>
        <p className="muted small">{CERT_HELP[c.certainty]}</p>
        {c.people && c.people.length > 0 && (
          <p className="small">
            <strong>Personas:</strong> {c.people.map((p) => (p === 'marcos' ? 'Marcos' : p === 'lucia' ? 'Lucía' : displayName(p))).join(', ')}
          </p>
        )}
        {contradictions.length > 0 && (
          <div className="ev-conflict">
            <p>
              <Icon name="advertencia" size={15} /> Choca con:
            </p>
            <ul>
              {contradictions.map((id) => (
                <li key={id}>
                  <button className="link-btn" onClick={() => openClue(id)}>
                    {clueById(id)?.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        <p className="small">
          <strong>Fuente:</strong> {c.source.label}
        </p>
        <div className="row-end">
          <button
            className="btn"
            disabled={onBoard}
            onClick={() =>
              dispatch({
                type: 'boardAddNode',
                node: { id: Math.random().toString(36).slice(2, 9), kind: c.kind, label: c.title, clueId: c.id, x: 40 + Math.random() * 500, y: 40 + Math.random() * 300 },
              })
            }
          >
            {onBoard ? 'Ya está en el tablero' : 'Añadir al tablero'}
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              openClue(null);
              openApp(c.source.app, c.source.id);
            }}
          >
            Abrir la prueba
          </button>
        </div>
      </div>
    </Modal>
  );
}
