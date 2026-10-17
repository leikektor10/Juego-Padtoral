import { useEffect, useState } from 'react';
import { audioById } from '../../data/audios';
import { clueById } from '../../data/clues';
import { files } from '../../data/records';
import { fmtDateTime } from '../../lib/format';
import { isAvailable } from '../../state/game';
import { useGame } from '../../state/GameContext';
import type { FileItem } from '../../types';
import { Icon } from '../Icons';
import { AppHeader } from './AppHeader';
import { AudioPlayer } from './AudioPlayer';

const FOLDERS: FileItem['folder'][] = ['Documentos', 'Descargas', 'Correo', 'Eliminados'];
const KIND_ICON: Record<FileItem['kind'], string> = {
  texto: 'notas',
  imagen: 'imagen',
  correo: 'correo',
  pdf: 'expediente',
  audio: 'musica',
  mensaje: 'mensajes',
};
const RECOVERABLE: Record<string, string> = { total: 'Recuperable', parcial: 'Recuperable en parte', no: 'Dañado' };

export function FilesApp() {
  const { state, nav, dispatch, discover, sound } = useGame();
  const [folder, setFolder] = useState<FileItem['folder'] | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [working, setWorking] = useState<string | null>(null);
  const [message, setMessage] = useState<{ id: string; text: string } | null>(null);

  useEffect(() => {
    dispatch({ type: 'see', key: 'app:archivos' });
  }, [dispatch]);

  useEffect(() => {
    if (nav.app !== 'archivos' || !nav.target) return;
    const f = files.find((x) => x.id === nav.target);
    if (!f) return;
    setFolder(f.folder);
    setOpen(!f.deleted || state.recovered[f.id] ? f.id : null);
    // Solo reacciona a navegaciones desde fuera de la app.
  }, [nav]);

  const file = open ? files.find((f) => f.id === open) : null;
  useEffect(() => {
    if (file && (!file.deleted || state.recovered[file.id])) discover([file.clue]);
  }, [file, state.recovered, discover]);

  const recover = (f: FileItem) => {
    const d = f.deleted!;
    if (d.recoverable === 'no') {
      sound('error');
      setMessage({ id: f.id, text: d.requirementHint });
      return;
    }
    const missing = d.requires.filter((c) => !state.clues[c]);
    if (missing.length) {
      sound('error');
      setMessage({ id: f.id, text: `No hay suficiente contexto para reconstruir este archivo. ${d.requirementHint}` });
      return;
    }
    setMessage(null);
    setWorking(f.id);
    window.setTimeout(
      () => {
        dispatch({ type: 'recover', fileId: f.id });
        sound('unlock');
        setWorking(null);
        setOpen(f.id);
      },
      state.settings.reduceMotion ? 100 : 1400,
    );
  };

  if (file && (!file.deleted || state.recovered[file.id])) {
    const audio = file.audioId ? audioById(file.audioId) : undefined;
    return (
      <div className="app">
        <AppHeader title={file.name} subtitle={`${fmtDateTime(file.at)} · ${file.size}`} onBack={() => setOpen(null)} />
        <div className="scroll pad">
          {file.deleted && (
            <p className={`recovered-tag ${file.deleted.recoverable}`}>
              <Icon name="recuperar" size={14} /> {file.deleted.recoverable === 'parcial' ? 'Recuperado en parte' : 'Recuperado'} · eliminado el{' '}
              {fmtDateTime(file.deleted.deletedAt)}
            </p>
          )}
          {file.image && <img className="file-image" src={file.image} alt={file.name} />}
          {audio && <AudioPlayer audio={audio} />}
          {file.content && (
            <div className={`file-doc ${file.kind}`}>
              <p className="pre">{file.content}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (folder) {
    const list = files.filter((f) => f.folder === folder && isAvailable(state, f.availableFrom)).sort((a, b) => b.at.localeCompare(a.at));
    return (
      <div className="app">
        <AppHeader title={folder} subtitle={`${list.length} elementos`} onBack={() => setFolder(null)} />
        {folder === 'Eliminados' && (
          <p className="notice small">
            Herramienta de recuperación: reconstruye archivos borrados a partir de fragmentos. Funciona cuando ya habéis encontrado la prueba
            relacionada con cada archivo.
          </p>
        )}
        <ul className="list scroll">
          {list.map((f) => {
            const recovered = !!state.recovered[f.id];
            return (
              <li key={f.id} className="file-row">
                <button className="list-item" onClick={() => (f.deleted && !recovered ? recover(f) : setOpen(f.id))} disabled={working === f.id}>
                  <span className={`folder-ico ${f.deleted && !recovered ? 'ghost' : ''}`}>
                    <Icon name={KIND_ICON[f.kind]} />
                  </span>
                  <span className="li-main">
                    <span className="li-title">{f.name}</span>
                    <span className="li-sub">
                      {f.deleted
                        ? recovered
                          ? `Recuperado · ${clueById(f.clue ?? '')?.title ?? ''}`
                          : `${RECOVERABLE[f.deleted.recoverable]} · eliminado ${fmtDateTime(f.deleted.deletedAt, false)}`
                        : `${fmtDateTime(f.at, false)} · ${f.size}`}
                    </span>
                  </span>
                  {f.deleted && !recovered && (
                    <span className="li-meta">{working === f.id ? <span className="spinner" aria-label="Recuperando" /> : 'Recuperar'}</span>
                  )}
                </button>
                {message?.id === f.id && (
                  <p className="recover-msg" role="alert">
                    {message.text}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  return (
    <div className="app">
      <AppHeader title="Archivos" />
      <ul className="list">
        {FOLDERS.map((f) => {
          const n = files.filter((x) => x.folder === f && isAvailable(state, x.availableFrom)).length;
          return (
            <li key={f}>
              <button className="list-item" onClick={() => setFolder(f)}>
                <span className={`folder-ico ${f === 'Eliminados' ? 'red' : ''}`}>
                  <Icon name={f === 'Eliminados' ? 'papelera' : f === 'Correo' ? 'correo' : 'archivos'} />
                </span>
                <span className="li-main">
                  <span className="li-title">{f === 'Eliminados' ? 'Eliminados recientemente' : f}</span>
                  <span className="li-sub">{n} elementos</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
