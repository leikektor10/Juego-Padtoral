import { useState } from 'react';
import { chapterById } from '../data/chapters';
import { useGame } from '../state/GameContext';
import { Confirm, Modal } from './Modal';

const SCALES = [
  { v: 1, label: 'Normal' },
  { v: 1.15, label: 'Grande' },
  { v: 1.3, label: 'Muy grande' },
];

export function SettingsDialog({ onClose, inGame }: { onClose: () => void; inGame: boolean }) {
  const { state, dispatch, openApp } = useGame();
  const [confirm, setConfirm] = useState<'reset' | 'skip' | null>(null);
  const s = state.settings;

  return (
    <>
      <Modal title="Ajustes de la experiencia" onClose={onClose}>
        <fieldset className="field">
          <legend>Tamaño del texto</legend>
          <div className="seg">
            {SCALES.map((o) => (
              <label key={o.v} className={`seg-item ${s.textScale === o.v ? 'on' : ''}`}>
                <input
                  type="radio"
                  name="scale"
                  checked={s.textScale === o.v}
                  onChange={() => dispatch({ type: 'settings', settings: { textScale: o.v } })}
                />
                {o.label}
              </label>
            ))}
          </div>
        </fieldset>
        <label className="toggle">
          <input type="checkbox" checked={s.sound} onChange={(e) => dispatch({ type: 'settings', settings: { sound: e.target.checked } })} />
          <span>Sonidos de interfaz</span>
        </label>
        <label className="toggle">
          <input
            type="checkbox"
            checked={s.reduceMotion}
            onChange={(e) => dispatch({ type: 'settings', settings: { reduceMotion: e.target.checked } })}
          />
          <span>Reducir animaciones</span>
        </label>
        <p className="muted small">El progreso se guarda automáticamente en este navegador.</p>

        {inGame && (
          <section className="facilitator-tools">
            <h3>Herramientas de facilitación</h3>
            {state.chapter <= 5 && !state.completed.includes(5) && (
              <button className="btn" onClick={() => setConfirm('skip')}>
                Dar por resuelto el capítulo {state.chapter}
              </button>
            )}
            <button className="btn btn-danger" onClick={() => setConfirm('reset')}>
              Reiniciar partida
            </button>
          </section>
        )}
      </Modal>
      {confirm === 'reset' && (
        <Confirm
          title="Reiniciar partida"
          text="Se borrarán todas las pistas, el tablero, las hipótesis y las respuestas guardadas en este dispositivo. Esta acción no se puede deshacer."
          confirmLabel="Reiniciar"
          danger
          onCancel={() => setConfirm(null)}
          onConfirm={() => {
            dispatch({ type: 'reset' });
            openApp(null);
            setConfirm(null);
            onClose();
          }}
        />
      )}
      {confirm === 'skip' && (
        <Confirm
          title={`Resolver «${chapterById(state.chapter).title}»`}
          text="Se marcarán como resueltas las deducciones de este capítulo y se registrarán las pistas que las sostienen. Úsalo solo si el grupo va justo de tiempo."
          confirmLabel="Resolver capítulo"
          onCancel={() => setConfirm(null)}
          onConfirm={() => {
            dispatch({ type: 'skipChapter' });
            setConfirm(null);
            onClose();
          }}
        />
      )}
    </>
  );
}
