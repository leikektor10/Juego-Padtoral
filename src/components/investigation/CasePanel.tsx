import { clues } from '../../data/clues';
import { useGame, type PanelTab } from '../../state/GameContext';
import { Icon } from '../Icons';
import { CaseTab } from './CaseTab';
import { CluesTab } from './CluesTab';
import { HintSystem } from './HintSystem';
import { HypothesisJournal } from './HypothesisJournal';
import { Timeline, useContradictions } from './Timeline';

const TABS: { id: PanelTab; label: string; icon: string }[] = [
  { id: 'caso', label: 'Caso', icon: 'expediente' },
  { id: 'pistas', label: 'Pistas', icon: 'pista' },
  { id: 'cronologia', label: 'Cronología', icon: 'cronologia' },
  { id: 'reconstruccion', label: 'Tablero', icon: 'tablero' },
  { id: 'hipotesis', label: 'Hipótesis', icon: 'hipotesis' },
  { id: 'ayuda', label: 'Ayuda', icon: 'ayuda' },
];

export function CasePanel() {
  const { state, panelTab, setPanelTab, setBoardOpen } = useGame();
  const found = clues.filter((c) => state.clues[c.id]).length;
  const contradictions = useContradictions().length;

  return (
    <aside className="case-panel" aria-label="Expediente de la investigación">
      <header className="panel-head">
        <h2>Expediente</h2>
        <div className="progress" aria-label={`Capítulo ${state.chapter} de 5`}>
          {[1, 2, 3, 4, 5].map((i) => (
            <span key={i} className={`step ${state.completed.includes(i as 1) ? 'done' : ''} ${state.chapter === i && state.unlocked ? 'now' : ''}`} />
          ))}
        </div>
      </header>
      <nav className="panel-tabs" role="tablist" aria-label="Secciones del expediente">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={panelTab === t.id}
            aria-controls="panel-body"
            className={panelTab === t.id ? 'on' : ''}
            onClick={() => setPanelTab(t.id)}
          >
            <Icon name={t.icon} size={18} />
            <span>{t.label}</span>
            {t.id === 'pistas' && found > 0 && <span className="count">{found}</span>}
            {t.id === 'cronologia' && contradictions > 0 && <span className="count warn">{contradictions}</span>}
          </button>
        ))}
      </nav>
      <div className="panel-body" id="panel-body" role="tabpanel" aria-labelledby={`tab-${panelTab}`}>
        {panelTab === 'caso' && <CaseTab />}
        {panelTab === 'pistas' && <CluesTab />}
        {panelTab === 'cronologia' && <Timeline />}
        {panelTab === 'reconstruccion' && <BoardSummary onOpen={() => setBoardOpen(true)} />}
        {panelTab === 'hipotesis' && <HypothesisJournal />}
        {panelTab === 'ayuda' && <HintSystem />}
      </div>
    </aside>
  );
}

function BoardSummary({ onOpen }: { onOpen: () => void }) {
  const { state } = useGame();
  const { nodes, edges } = state.board;
  const label = (id: string) => nodes.find((n) => n.id === id)?.label ?? '?';
  return (
    <div className="board-summary">
      <p>
        El tablero de <strong>Reconstrucción</strong> sirve para reunir pruebas, personas, fechas e hipótesis y unirlas con líneas. Las conexiones
        son vuestra interpretación: nadie las corrige.
      </p>
      <button className="btn btn-primary" onClick={onOpen}>
        <Icon name="tablero" size={18} /> Abrir el tablero
      </button>
      <p className="muted small">
        {nodes.length} tarjetas · {edges.length} conexiones
      </p>
      {edges.length > 0 && (
        <>
          <h4>Conexiones del grupo</h4>
          <ul className="edge-list">
            {edges.map((e) => (
              <li key={e.id}>
                {label(e.from)} <span className="muted">— {e.label || 'relacionado con'} —</span> {label(e.to)}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
