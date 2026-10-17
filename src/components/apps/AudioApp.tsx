import { useEffect, useState } from 'react';
import { audios } from '../../data/audios';
import { files } from '../../data/records';
import { fmtDateTime, fmtDuration } from '../../lib/format';
import { useGame } from '../../state/GameContext';
import type { AudioNote } from '../../types';
import { Icon } from '../Icons';
import { AppHeader } from './AppHeader';
import { AudioPlayer } from './AudioPlayer';

export function AudioApp() {
  const { state, nav } = useGame();
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    if (nav.app === 'grabadora' && nav.target) setOpen(nav.target);
  }, [nav]);

  // Un audio eliminado aparece en la grabadora solo cuando se ha recuperado desde Archivos.
  const recoveredIds = files.filter((f) => f.audioId && state.recovered[f.id]).map((f) => f.audioId);
  const own = audios.filter((a) => a.location === 'grabadora' || (a.location === 'eliminado' && recoveredIds.includes(a.id)));
  const fromChats = audios.filter((a) => a.location === 'chat');

  const current = audios.find((a) => a.id === open);
  if (current && (current.location !== 'eliminado' || recoveredIds.includes(current.id))) {
    return (
      <div className="app">
        <AppHeader title={current.title} subtitle={fmtDateTime(current.at)} onBack={() => setOpen(null)} />
        <div className="scroll pad">
          <p className="muted small">
            {current.place && (
              <>
                <Icon name="ubicacion" size={13} /> {current.place} ·{' '}
              </>
            )}
            {current.context}
          </p>
          <AudioPlayer audio={current} />
        </div>
      </div>
    );
  }

  const row = (a: AudioNote) => (
    <li key={a.id}>
      <button className="list-item" onClick={() => setOpen(a.id)}>
        <span className="folder-ico red">
          <Icon name="grabadora" />
        </span>
        <span className="li-main">
          <span className="li-title">
            {a.title}
            {a.location === 'eliminado' && <span className="tag">Recuperado</span>}
          </span>
          <span className="li-sub">{fmtDateTime(a.at)}</span>
        </span>
        <span className="li-meta">{fmtDuration(a.duration)}</span>
      </button>
    </li>
  );

  return (
    <div className="app">
      <AppHeader title="Grabadora" subtitle="Grabaciones y notas de voz" />
      <div className="scroll">
        <h3 className="group-label">Grabaciones</h3>
        <ul className="list">{own.sort((a, b) => b.at.localeCompare(a.at)).map(row)}</ul>
        <h3 className="group-label">Notas de voz de los chats</h3>
        <ul className="list">{fromChats.sort((a, b) => b.at.localeCompare(a.at)).map(row)}</ul>
        <p className="muted small pad">Todas las grabaciones tienen subtítulos y transcripción completa.</p>
      </div>
    </div>
  );
}
