import { useEffect, useState } from 'react';
import { chapterById } from '../data/chapters';
import { useGame } from '../state/GameContext';
import { Icon } from './Icons';
import { CasePanel } from './investigation/CasePanel';
import { EvidenceDrawer } from './investigation/EvidenceDrawer';
import { InvestigationBoard } from './investigation/InvestigationBoard';
import { Modal } from './Modal';
import { PhoneShell } from './PhoneShell';
import { SettingsDialog } from './SettingsDialog';

export function GameLayout() {
  const { state, view, setView, boardOpen, setBoardOpen } = useGame();
  const [settings, setSettings] = useState(false);
  const [paused, setPaused] = useState(false);

  return (
    <div className={`game view-${view}`}>
      <header className="topbar">
        <div className="brand">
          <span className="brand-title">ÚLTIMA CONEXIÓN</span>
          <span className="brand-sub">
            {state.unlocked ? `Capítulo ${state.chapter} · ${chapterById(state.chapter).title}` : 'Teléfono bloqueado'}
          </span>
        </div>
        <div className="topbar-actions">
          <button className="btn btn-small btn-ghost" onClick={() => setPaused(true)}>
            <Icon name="pausa" size={14} /> Pausa
          </button>
          <button className="btn btn-small btn-ghost" onClick={() => setSettings(true)} aria-label="Ajustes de la experiencia">
            <Icon name="ajustes" size={16} /> <span className="hide-sm">Ajustes</span>
          </button>
        </div>
      </header>

      <div className="stage">
        <section className="phone-area" aria-label="Teléfono">
          <PhoneShell />
        </section>
        <CasePanel />
      </div>

      <nav className="view-switch" aria-label="Cambiar de vista">
        <button className={view === 'telefono' ? 'on' : ''} onClick={() => setView('telefono')} aria-pressed={view === 'telefono'}>
          <Icon name="telefono" size={18} /> Teléfono
        </button>
        <button className={view === 'expediente' ? 'on' : ''} onClick={() => setView('expediente')} aria-pressed={view === 'expediente'}>
          <Icon name="expediente" size={18} /> Expediente
        </button>
      </nav>

      <Toasts />
      <EvidenceDrawer />
      <ChapterIntro />
      {boardOpen && <InvestigationBoard onClose={() => setBoardOpen(false)} />}
      {settings && <SettingsDialog onClose={() => setSettings(false)} inGame />}
      {paused && <PauseOverlay onResume={() => setPaused(false)} />}
    </div>
  );
}

function Toasts() {
  const { toasts, dismissToast, openClue } = useGame();
  return (
    <div className="toasts" aria-live="polite" aria-atomic="false">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.kind}`}>
          {t.kind === 'pista' && <Icon name="pista" size={18} />}
          <div className="toast-text">
            <strong>{t.text}</strong>
            {t.detail && <span>{t.detail}</span>}
          </div>
          {t.clueId && (
            <button
              className="link-btn"
              onClick={() => {
                openClue(t.clueId!);
                dismissToast(t.id);
              }}
            >
              Ver
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

function ChapterIntro() {
  const { state, dispatch, sound, pushToast, setPanelTab } = useGame();
  const id = state.chapterIntro;

  useEffect(() => {
    if (!id) return;
    sound('chapter');
    if (id === 4) pushToast({ kind: 'aviso', text: 'Sincronización completada', detail: 'Han llegado mensajes nuevos de remitentes no guardados.' });
  }, [id, sound, pushToast]);

  if (!id) return null;
  const ch = chapterById(id);
  const prev = id > 1 ? chapterById(id - 1) : null;
  const close = () => {
    dispatch({ type: 'dismissIntro' });
    setPanelTab('caso');
  };
  return (
    <Modal title={`Capítulo ${id}: ${ch.title}`} onClose={close} className="chapter-modal">
      {prev && <p className="chapter-outro">«{prev.outro}»</p>}
      <p className="eyebrow">Capítulo {id} de 5</p>
      <h3 className="chapter-name">{ch.title}</h3>
      <p>{ch.intro}</p>
      <p className="muted">
        <strong>Objetivo:</strong> {ch.objective}
      </p>
      <div className="row-end">
        <button className="btn btn-primary" onClick={close}>
          Continuar la investigación
        </button>
      </div>
    </Modal>
  );
}

function PauseOverlay({ onResume }: { onResume: () => void }) {
  const { dispatch } = useGame();
  return (
    <div className="pause" role="dialog" aria-modal="true" aria-label="Juego en pausa">
      <div className="pause-inner">
        <p className="eyebrow">En pausa</p>
        <h2>Tomaos el tiempo que necesitéis.</h2>
        <p className="muted">El progreso está guardado. Podéis retomar la investigación cuando queráis o dejarla aquí.</p>
        <div className="row-center">
          <button className="btn btn-primary" onClick={onResume} autoFocus>
            Continuar
          </button>
          <button className="btn" onClick={() => dispatch({ type: 'setPhase', phase: 'titulo' })}>
            Salir a la portada
          </button>
        </div>
      </div>
    </div>
  );
}
