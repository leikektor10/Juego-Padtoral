import { useState } from 'react';
import { clues } from '../../data/clues';
import { fmtDateTime } from '../../lib/format';
import { useGame } from '../../state/GameContext';
import type { ClueKind } from '../../types';

export const KIND_LABEL: Record<ClueKind, string> = {
  persona: 'Persona',
  fecha: 'Fecha',
  acontecimiento: 'Acontecimiento',
  mensaje: 'Mensaje',
  foto: 'Foto',
  documento: 'Documento',
  lugar: 'Lugar',
};

export const CERTAINTY_LABEL = {
  hecho: 'Hecho comprobado',
  testimonio: 'Testimonio',
  interpretacion: 'Interpretación',
} as const;

export function CluesTab() {
  const { state, openClue } = useGame();
  const [kind, setKind] = useState<ClueKind | 'todas'>('todas');
  const [order, setOrder] = useState<'recientes' | 'fecha'>('recientes');

  const found = clues.filter((c) => state.clues[c.id]);
  const list = found
    .filter((c) => kind === 'todas' || c.kind === kind)
    .sort((a, b) => (order === 'recientes' ? state.clues[b.id] - state.clues[a.id] : (a.date ?? '9').localeCompare(b.date ?? '9')));

  return (
    <div className="clues-tab">
      <p className="muted small">
        {found.length} pistas descubiertas. Se registran al leer, ampliar, escuchar o recuperar pruebas en el teléfono.
      </p>
      <div className="chips" role="group" aria-label="Filtrar por tipo">
        {(['todas', ...Object.keys(KIND_LABEL)] as const).map((k) => (
          <button key={k} className={`chip small ${kind === k ? 'on' : ''}`} onClick={() => setKind(k as ClueKind | 'todas')} aria-pressed={kind === k}>
            {k === 'todas' ? 'Todas' : KIND_LABEL[k as ClueKind]}
          </button>
        ))}
      </div>
      <div className="seg small" role="group" aria-label="Orden">
        <button className={order === 'recientes' ? 'on' : ''} onClick={() => setOrder('recientes')} aria-pressed={order === 'recientes'}>
          Últimas encontradas
        </button>
        <button className={order === 'fecha' ? 'on' : ''} onClick={() => setOrder('fecha')} aria-pressed={order === 'fecha'}>
          Por fecha
        </button>
      </div>
      {list.length === 0 ? (
        <p className="empty">Todavía no hay pistas de este tipo.</p>
      ) : (
        <ul className="clue-list">
          {list.map((c) => (
            <li key={c.id}>
              <button className={`clue-item ci-${c.certainty}`} onClick={() => openClue(c.id)}>
                <span className="clue-title">{c.title}</span>
                <span className="clue-meta">
                  <span className={`cert cert-${c.certainty}`}>{CERTAINTY_LABEL[c.certainty]}</span>
                  {c.date && <span>{fmtDateTime(c.date, false)}</span>}
                  <span>{KIND_LABEL[c.kind]}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
