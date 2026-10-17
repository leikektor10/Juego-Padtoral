import { useMemo, useRef, useState } from 'react';
import { clueById, clues } from '../../data/clues';
import { contacts } from '../../data/contacts';
import { isAvailable, type BoardNode } from '../../state/game';
import { useGame } from '../../state/GameContext';
import { Icon } from '../Icons';
import { KIND_LABEL } from './CluesTab';

// Tablero libre: las conexiones son interpretaciones del grupo y no se califican.

const W = 1800;
const H = 1200;
const NODE_W = 180;

const KIND_CLASS: Record<BoardNode['kind'], string> = {
  persona: 'k-persona',
  fecha: 'k-fecha',
  acontecimiento: 'k-acontecimiento',
  mensaje: 'k-mensaje',
  foto: 'k-foto',
  hipotesis: 'k-hipotesis',
  documento: 'k-documento',
  lugar: 'k-lugar',
};

const uid = () => Math.random().toString(36).slice(2, 9);

export function InvestigationBoard({ onClose }: { onClose: () => void }) {
  const { state, dispatch, openClue } = useGame();
  const { nodes, edges } = state.board;
  const [selected, setSelected] = useState<string | null>(null);
  const [connectFrom, setConnectFrom] = useState<string | null>(null);
  const [selEdge, setSelEdge] = useState<string | null>(null);
  const [filter, setFilter] = useState('');
  const [custom, setCustom] = useState('');
  const [customKind, setCustomKind] = useState<BoardNode['kind']>('hipotesis');
  const canvas = useRef<HTMLDivElement>(null);
  const drag = useRef<{ id: string; dx: number; dy: number } | null>(null);

  const placeNew = () => {
    const n = nodes.length;
    const sc = canvas.current;
    const baseX = (sc?.scrollLeft ?? 0) + 60;
    const baseY = (sc?.scrollTop ?? 0) + 60;
    return { x: baseX + (n % 4) * 200, y: baseY + Math.floor((n % 12) / 4) * 110 };
  };

  const addClue = (id: string) => {
    const c = clueById(id)!;
    dispatch({ type: 'boardAddNode', node: { id: uid(), kind: c.kind, label: c.title, clueId: id, ...placeNew() } });
  };

  const addCustom = (label: string, kind: BoardNode['kind']) => {
    if (!label.trim()) return;
    dispatch({ type: 'boardAddNode', node: { id: uid(), kind, label: label.trim(), ...placeNew() } });
  };

  const people = useMemo(
    () => [
      { id: 'marcos', name: 'Marcos' },
      { id: 'lucia', name: 'Lucía' },
      ...contacts.filter((c) => isAvailable(state, c.availableFrom) && c.id !== 'instituto').map((c) => ({ id: c.id, name: c.shortName })),
    ],
    [state],
  );

  const onNodeClick = (id: string) => {
    setSelEdge(null);
    if (connectFrom && connectFrom !== id) {
      dispatch({ type: 'boardAddEdge', edge: { id: uid(), from: connectFrom, to: id, label: '' } });
      setConnectFrom(null);
      setSelected(id);
      return;
    }
    setSelected(id);
  };

  const onPointerDown = (e: React.PointerEvent, n: BoardNode) => {
    if (connectFrom) return;
    const rect = canvas.current!.getBoundingClientRect();
    drag.current = {
      id: n.id,
      dx: e.clientX - rect.left + canvas.current!.scrollLeft - n.x,
      dy: e.clientY - rect.top + canvas.current!.scrollTop - n.y,
    };
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const rect = canvas.current!.getBoundingClientRect();
    const x = Math.max(0, Math.min(W - NODE_W, e.clientX - rect.left + canvas.current!.scrollLeft - drag.current.dx));
    const y = Math.max(0, Math.min(H - 60, e.clientY - rect.top + canvas.current!.scrollTop - drag.current.dy));
    dispatch({ type: 'boardMoveNode', id: drag.current.id, x, y });
  };
  const onPointerUp = () => {
    drag.current = null;
  };

  const onNodeKey = (e: React.KeyboardEvent, n: BoardNode) => {
    const step = e.shiftKey ? 50 : 16;
    const moves: Record<string, [number, number]> = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
    if (moves[e.key]) {
      e.preventDefault();
      const [dx, dy] = moves[e.key];
      dispatch({ type: 'boardMoveNode', id: n.id, x: Math.max(0, n.x + dx), y: Math.max(0, n.y + dy) });
    }
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onNodeClick(n.id);
    }
    if (e.key === 'Delete' || e.key === 'Backspace') dispatch({ type: 'boardRemoveNode', id: n.id });
  };

  const center = (n: BoardNode) => ({ x: n.x + NODE_W / 2, y: n.y + 30 });
  const selNode = nodes.find((n) => n.id === selected);
  const edge = edges.find((e) => e.id === selEdge);
  const onBoard = new Set(nodes.map((n) => n.clueId).filter(Boolean));
  const available = clues
    .filter((c) => state.clues[c.id] && !onBoard.has(c.id))
    .filter((c) => !filter || c.title.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="board-overlay" role="dialog" aria-modal="true" aria-label="Reconstrucción: tablero de investigación">
      <header className="board-head">
        <div>
          <h2>Reconstrucción</h2>
          <p className="muted small">Arrastrad las tarjetas (o usad las flechas del teclado). Para unirlas: «Conectar» y después pulsad otra tarjeta.</p>
        </div>
        <button className="btn" onClick={onClose}>
          <Icon name="cerrar" size={16} /> Cerrar tablero
        </button>
      </header>
      <div className="board-body">
        <aside className="board-side" aria-label="Añadir al tablero">
          <h3>Pistas encontradas</h3>
          <input className="input small" placeholder="Filtrar…" value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filtrar pistas" />
          <ul className="board-add-list">
            {available.length === 0 && <li className="muted small">No hay pistas pendientes de añadir.</li>}
            {available.map((c) => (
              <li key={c.id}>
                <button className="add-item" onClick={() => addClue(c.id)}>
                  <Icon name="mas" size={14} /> <span>{c.title}</span>
                </button>
              </li>
            ))}
          </ul>
          <h3>Personas</h3>
          <div className="chips">
            {people.map((p) => (
              <button key={p.id} className="chip small" onClick={() => addCustom(p.name, 'persona')}>
                + {p.name}
              </button>
            ))}
          </div>
          <h3>Nota propia</h3>
          <form
            className="custom-node"
            onSubmit={(e) => {
              e.preventDefault();
              addCustom(custom, customKind);
              setCustom('');
            }}
          >
            <select className="input small" value={customKind} onChange={(e) => setCustomKind(e.target.value as BoardNode['kind'])} aria-label="Tipo de nota">
              <option value="hipotesis">Hipótesis</option>
              <option value="acontecimiento">Acontecimiento</option>
              <option value="fecha">Fecha</option>
              <option value="persona">Persona</option>
            </select>
            <input className="input small" value={custom} onChange={(e) => setCustom(e.target.value)} placeholder="Escribid…" aria-label="Texto de la nota" />
            <button className="btn btn-small" type="submit">
              Añadir
            </button>
          </form>
          <div className="legend">
            {(['persona', 'fecha', 'acontecimiento', 'mensaje', 'foto', 'documento', 'lugar', 'hipotesis'] as const).map((k) => (
              <span key={k} className={`legend-item ${KIND_CLASS[k]}`}>
                {k === 'hipotesis' ? 'Hipótesis' : KIND_LABEL[k]}
              </span>
            ))}
          </div>
        </aside>
        <div className="board-main">
          <div className="board-toolbar" aria-live="polite">
            {connectFrom ? (
              <>
                <span>Pulsad la tarjeta con la que conectar «{nodes.find((n) => n.id === connectFrom)?.label}».</span>
                <button className="btn btn-small" onClick={() => setConnectFrom(null)}>
                  Cancelar
                </button>
              </>
            ) : selNode ? (
              <>
                <strong className="ellipsis">{selNode.label}</strong>
                <button className="btn btn-small btn-primary" onClick={() => setConnectFrom(selNode.id)}>
                  <Icon name="enlace" size={14} /> Conectar
                </button>
                {selNode.clueId && (
                  <button className="btn btn-small" onClick={() => openClue(selNode.clueId!)}>
                    Ver pista
                  </button>
                )}
                <button
                  className="btn btn-small btn-danger"
                  onClick={() => {
                    dispatch({ type: 'boardRemoveNode', id: selNode.id });
                    setSelected(null);
                  }}
                >
                  Quitar
                </button>
              </>
            ) : edge ? (
              <>
                <label className="edge-label-input">
                  Relación:
                  <input
                    className="input small"
                    value={edge.label}
                    placeholder="p. ej. «no lo sabía», «contradice», «el mismo día»"
                    onChange={(e) => dispatch({ type: 'boardUpdateEdge', id: edge.id, label: e.target.value })}
                    autoFocus
                  />
                </label>
                <button
                  className="btn btn-small btn-danger"
                  onClick={() => {
                    dispatch({ type: 'boardRemoveEdge', id: edge.id });
                    setSelEdge(null);
                  }}
                >
                  Borrar conexión
                </button>
              </>
            ) : (
              <span className="muted">
                {nodes.length} tarjetas · {edges.length} conexiones. Seleccionad una tarjeta o una línea.
              </span>
            )}
          </div>
          <div className="board-canvas" ref={canvas} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerLeave={onPointerUp}>
            <div className="board-plane" style={{ width: W, height: H }} onClick={(e) => e.target === e.currentTarget && (setSelected(null), setSelEdge(null))}>
              <svg className="board-edges" width={W} height={H}>
                {edges.map((e) => {
                  const a = nodes.find((n) => n.id === e.from);
                  const b = nodes.find((n) => n.id === e.to);
                  if (!a || !b) return null;
                  const p = center(a);
                  const q = center(b);
                  return (
                    <g key={e.id} className={`edge ${selEdge === e.id ? 'sel' : ''}`} onClick={() => (setSelEdge(e.id), setSelected(null))}>
                      <line x1={p.x} y1={p.y} x2={q.x} y2={q.y} className="edge-hit" />
                      <line x1={p.x} y1={p.y} x2={q.x} y2={q.y} className="edge-line" />
                      {e.label && (
                        <text x={(p.x + q.x) / 2} y={(p.y + q.y) / 2 - 6} textAnchor="middle" className="edge-text">
                          {e.label}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
              {nodes.map((n) => (
                <div
                  key={n.id}
                  role="button"
                  tabIndex={0}
                  className={`node ${KIND_CLASS[n.kind]} ${selected === n.id ? 'sel' : ''} ${connectFrom === n.id ? 'from' : ''}`}
                  style={{ left: n.x, top: n.y, width: NODE_W }}
                  onPointerDown={(e) => onPointerDown(e, n)}
                  onClick={() => onNodeClick(n.id)}
                  onKeyDown={(e) => onNodeKey(e, n)}
                  aria-label={`${n.kind === 'hipotesis' ? 'Hipótesis' : KIND_LABEL[n.kind]}: ${n.label}`}
                >
                  <span className="node-kind">{n.kind === 'hipotesis' ? 'Hipótesis' : KIND_LABEL[n.kind]}</span>
                  <span className="node-label">{n.label}</span>
                </div>
              ))}
              {nodes.length === 0 && (
                <p className="board-empty">Añadid pistas, personas o hipótesis desde el panel lateral para empezar a reconstruir la historia.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
