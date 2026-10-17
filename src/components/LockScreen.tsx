import { useEffect, useMemo, useState } from 'react';
import { chats, LAST_CONNECTION } from '../data/chats';
import { PHONE_NOW } from '../data/meta';
import { LOCK_WALLPAPER } from '../data/photos';
import { syncPercent } from '../state/game';
import { useGame } from '../state/GameContext';
import { Icon } from './Icons';

export const PIN = '1406';

/** Mensajes que llegaron al encender el teléfono, por conversación (oleada inicial). */
export function useSyncedCounts() {
  return useMemo(
    () =>
      chats
        .filter((c) => !c.availableFrom)
        .map((c) => ({
          chat: c,
          count: c.messages.filter((m) => m.at > LAST_CONNECTION && m.from !== 'yo' && !m.availableFrom).length,
        }))
        .filter((x) => x.count > 0)
        .sort((a, b) => b.count - a.count),
    [],
  );
}

export function LockScreen({ time }: { time: string }) {
  const { state, dispatch, sound, media, pushToast } = useGame();
  const [mode, setMode] = useState<'lock' | 'pin' | 'wallpaper'>('lock');
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const counts = useSyncedCounts();

  const press = (d: string) => {
    if (pin.length >= 4) return;
    sound('tap');
    setError(false);
    setPin((p) => p + d);
  };

  useEffect(() => {
    if (pin.length < 4) return;
    if (pin === PIN) {
      sound('unlock');
      dispatch({ type: 'unlock' });
      pushToast({ kind: 'info', text: 'Teléfono desbloqueado', detail: 'Sincronización de mensajes en curso…' });
    } else {
      sound('error');
      setError(true);
      const t = window.setTimeout(() => setPin(''), 600);
      return () => window.clearTimeout(t);
    }
  }, [pin, dispatch, sound, pushToast]);

  // Teclado físico para el PIN.
  useEffect(() => {
    if (mode !== 'pin') return;
    const onKey = (e: KeyboardEvent) => {
      if (/^\d$/.test(e.key)) press(e.key);
      if (e.key === 'Backspace') setPin((p) => p.slice(0, -1));
      if (e.key === 'Escape') setMode('lock');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const wallpaper = media('fondo-bloqueo', LOCK_WALLPAPER);

  if (mode === 'wallpaper') {
    return (
      <div className="lock wallpaper-only" style={{ backgroundImage: `url(${wallpaper})` }}>
        <span className="sr-only">
          Fondo de pantalla: una foto de cumpleaños. Un chico y una niña con coletas junto a una tarta con una vela con el número 9. Una pancarta
          dice «¡Feliz cumple, enana! 14 · 06». En la tarta pone «Lucía · 9».
        </span>
        <button className="btn btn-glass lock-back" onClick={() => setMode('lock')}>
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="lock" style={{ backgroundImage: `url(${wallpaper})` }}>
      <div className="lock-shade" />
      {mode === 'lock' ? (
        <div className="lock-inner">
          <div className="lock-clock">
            <Icon name="candado" size={18} />
            <div className="lock-time">{time}</div>
            <div className="lock-date">{PHONE_NOW.label}</div>
          </div>
          <ul className="lock-notifs" aria-label="Notificaciones">
            <li className="notif notif-sys">
              <Icon name="sync" size={16} />
              <div>
                <strong>Mensajes · 47 días sin conexión</strong>
                <span>Descargando mensajes pendientes… {syncPercent(state)} %</span>
              </div>
            </li>
            {counts.slice(0, 5).map(({ chat, count }) => (
              <li className="notif" key={chat.id}>
                <span className="avatar sm" style={{ background: chat.color }}>
                  {chat.initials}
                </span>
                <div>
                  <strong>{chat.title}</strong>
                  <span>
                    {count} {count === 1 ? 'mensaje nuevo' : 'mensajes nuevos'}
                  </span>
                </div>
              </li>
            ))}
          </ul>
          <div className="lock-actions">
            <button className="btn btn-glass" onClick={() => setMode('wallpaper')}>
              <Icon name="ojo" size={18} /> Ver fondo
            </button>
            <button className="btn btn-glass" onClick={() => setMode('pin')}>
              <Icon name="candado" size={18} /> Desbloquear
            </button>
          </div>
        </div>
      ) : (
        <div className="lock-inner pin-pad">
          <p className="pin-title">Introduce el PIN</p>
          <div className={`pin-dots ${error ? 'shake' : ''}`} aria-live="assertive" aria-label={`${pin.length} de 4 cifras`}>
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className={i < pin.length ? 'filled' : ''} />
            ))}
          </div>
          <p className="pin-error" role="alert">
            {error ? 'PIN incorrecto' : ' '}
          </p>
          <div className="pin-grid">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
              <button key={d} className="pin-key" onClick={() => press(d)} aria-label={`Cifra ${d}`}>
                {d}
              </button>
            ))}
            <button className="pin-key pin-text" onClick={() => setMode('lock')}>
              Cancelar
            </button>
            <button className="pin-key" onClick={() => press('0')} aria-label="Cifra 0">
              0
            </button>
            <button className="pin-key pin-text" onClick={() => setPin((p) => p.slice(0, -1))}>
              Borrar
            </button>
          </div>
          <p className="pin-help">También podéis escribir con el teclado.</p>
        </div>
      )}
    </div>
  );
}
