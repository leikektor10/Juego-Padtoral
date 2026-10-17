import { chats, LAST_CONNECTION } from '../data/chats';
import { LOCK_WALLPAPER } from '../data/photos';
import { files } from '../data/records';
import { isAvailable } from '../state/game';
import { useGame } from '../state/GameContext';
import type { AppId } from '../types';
import { Icon } from './Icons';

export const APP_META: { id: AppId; label: string; color: string }[] = [
  { id: 'mensajes', label: 'Mensajes', color: '#2f8f6a' },
  { id: 'llamadas', label: 'Teléfono', color: '#3d8b4f' },
  { id: 'contactos', label: 'Contactos', color: '#6b7280' },
  { id: 'galeria', label: 'Galería', color: '#c0704a' },
  { id: 'notas', label: 'Notas', color: '#c9a227' },
  { id: 'grabadora', label: 'Grabadora', color: '#b5483b' },
  { id: 'calendario', label: 'Calendario', color: '#4a6fa5' },
  { id: 'archivos', label: 'Archivos', color: '#5d6d7e' },
  { id: 'mapas', label: 'Mapas', color: '#3f8a8a' },
  { id: 'navegador', label: 'Navegador', color: '#5b5fa8' },
  { id: 'buscar', label: 'Buscar', color: '#444b57' },
  { id: 'ajustes', label: 'Ajustes', color: '#555a62' },
];

/** Número de mensajes recibidos al sincronizar que aún no se han leído. */
export function useUnread() {
  const { state } = useGame();
  return chats
    .filter((c) => isAvailable(state, c.availableFrom) && !state.seen[`chat:${c.id}`])
    .reduce(
      (n, c) => n + c.messages.filter((m) => m.at > LAST_CONNECTION && m.from !== 'yo' && isAvailable(state, m.availableFrom)).length,
      0,
    );
}

export function HomeScreen() {
  const { state, openApp, media, sound } = useGame();
  const unread = useUnread();
  const deletedPending = files.filter((f) => f.deleted && f.deleted.recoverable !== 'no' && !state.recovered[f.id]).length;

  const badge = (id: AppId) => {
    if (id === 'mensajes') return unread;
    if (id === 'archivos' && !state.seen['app:archivos']) return deletedPending;
    if (id === 'notas' && !state.diaryUnlocked && !state.seen['app:notas']) return 1;
    return 0;
  };

  return (
    <div className="home" style={{ backgroundImage: `url("${media('fondo-bloqueo', LOCK_WALLPAPER)}")` }}>
      <div className="home-shade" />
      <nav className="app-grid" aria-label="Aplicaciones">
        {APP_META.map((a) => {
          const b = badge(a.id);
          return (
            <button
              key={a.id}
              className="app-icon"
              onClick={() => {
                sound('tap');
                openApp(a.id);
              }}
              aria-label={`${a.label}${b ? `, ${b} elementos nuevos` : ''}`}
            >
              <span className="app-glyph" style={{ background: a.color }}>
                <Icon name={a.id} size={26} />
                {b > 0 && <span className="badge">{b > 99 ? '99+' : b}</span>}
              </span>
              <span className="app-label">{a.label}</span>
            </button>
          );
        })}
      </nav>
      <p className="home-hint">Pulsa una aplicación para examinarla. La barra inferior vuelve aquí.</p>
    </div>
  );
}
