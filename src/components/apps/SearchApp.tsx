import { useMemo, useState } from 'react';
import { audios } from '../../data/audios';
import { chats } from '../../data/chats';
import { contacts, displayName } from '../../data/contacts';
import { diary, notes } from '../../data/diary';
import { photos } from '../../data/photos';
import { browserHistory, calendarEvents, files, places } from '../../data/records';
import { fmtDate } from '../../lib/format';
import { isAvailable } from '../../state/game';
import { useGame } from '../../state/GameContext';
import type { AppId } from '../../types';
import { AppHeader } from './AppHeader';

interface Doc {
  app: AppId;
  target: string;
  kind: string;
  title: string;
  text: string;
  at?: string;
}

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');

/** Buscador del dispositivo: recorre todo el contenido accesible en este momento. */
export function SearchApp() {
  const { state, openApp } = useGame();
  const [q, setQ] = useState('');

  const index = useMemo(() => {
    const docs: Doc[] = [];
    chats
      .filter((c) => isAvailable(state, c.availableFrom))
      .forEach((c) =>
        c.messages
          .filter((m) => isAvailable(state, m.availableFrom) && m.text && !m.deleted)
          .forEach((m) => docs.push({ app: 'mensajes', target: `${c.id}#${m.id}`, kind: 'Mensaje', title: `${c.title} · ${displayName(m.from)}`, text: m.text!, at: m.at })),
      );
    notes.forEach((n) => docs.push({ app: 'notas', target: n.id, kind: 'Nota', title: n.title, text: n.text, at: n.at }));
    if (state.diaryUnlocked)
      diary.forEach((d) => docs.push({ app: 'notas', target: `diario:${d.id}`, kind: 'Diario', title: d.title, text: d.paragraphs.join(' '), at: d.at }));
    files
      .filter((f) => isAvailable(state, f.availableFrom) && (!f.deleted || state.recovered[f.id]))
      .forEach((f) => docs.push({ app: 'archivos', target: f.id, kind: 'Archivo', title: f.name, text: f.content ?? '', at: f.at }));
    files
      .filter((f) => f.deleted && !state.recovered[f.id])
      .forEach((f) => docs.push({ app: 'archivos', target: f.id, kind: 'Eliminado', title: f.name, text: '', at: f.at }));
    calendarEvents.forEach((e) => docs.push({ app: 'calendario', target: e.id, kind: 'Evento', title: e.title, text: e.notes ?? '', at: e.date }));
    contacts
      .filter((c) => isAvailable(state, c.availableFrom))
      .forEach((c) => docs.push({ app: 'contactos', target: c.id, kind: 'Contacto', title: c.name, text: `${c.relation} ${c.phone} ${c.agendaNote ?? ''}` }));
    browserHistory.forEach((b) => docs.push({ app: 'navegador', target: b.id, kind: 'Búsqueda web', title: b.query, text: b.visited ?? '', at: b.at }));
    photos
      .filter((p) => isAvailable(state, p.availableFrom))
      .forEach((p) => docs.push({ app: 'galeria', target: p.id, kind: 'Foto', title: p.title, text: `${p.description} ${p.place ?? ''}`, at: p.at }));
    audios
      .filter((a) => a.location !== 'eliminado' || files.some((f) => f.audioId === a.id && state.recovered[f.id]))
      .forEach((a) =>
        docs.push({ app: 'grabadora', target: a.id, kind: 'Audio', title: a.title, text: a.segments.map((s) => s.text).join(' '), at: a.at }),
      );
    places.forEach((p) => docs.push({ app: 'mapas', target: p.id, kind: 'Lugar', title: p.name, text: p.description }));
    return docs.map((d) => ({ ...d, hay: norm(`${d.title} ${d.text}`) }));
  }, [state]);

  const needle = norm(q.trim());
  const results = needle.length >= 2 ? index.filter((d) => d.hay.includes(needle)).slice(0, 80) : [];

  const snippet = (text: string) => {
    const i = norm(text).indexOf(needle);
    if (i < 0) return text.slice(0, 90);
    const start = Math.max(0, i - 35);
    return `${start > 0 ? '…' : ''}${text.slice(start, i)}<<${text.slice(i, i + needle.length)}>>${text.slice(i + needle.length, i + needle.length + 50)}…`;
  };

  return (
    <div className="app">
      <AppHeader title="Buscar en el teléfono" />
      <div className="pad">
        <label className="sr-only" htmlFor="search-q">
          Buscar
        </label>
        <input
          id="search-q"
          className="input"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Nombre, fecha, lugar, palabra…"
          autoFocus
        />
        <p className="muted small">
          {needle.length < 2
            ? 'Busca en mensajes, notas, archivos, calendario, fotos, audios y más. Ejemplos: «Santa Olaria», «almacén», «Lucía».'
            : `${results.length} resultado${results.length === 1 ? '' : 's'}`}
        </p>
      </div>
      <ul className="list scroll">
        {results.map((r, i) => {
          const parts = snippet(r.text || r.title).split(/<<|>>/);
          return (
            <li key={`${r.target}-${i}`}>
              <button className="list-item" onClick={() => openApp(r.app, r.target)}>
                <span className="li-main">
                  <span className="li-title">
                    <span className="tag">{r.kind}</span> {r.title}
                  </span>
                  <span className="li-sub">
                    {parts.map((p, k) => (k % 2 ? <mark key={k}>{p}</mark> : <span key={k}>{p}</span>))}
                  </span>
                </span>
                {r.at && <span className="li-meta">{fmtDate(r.at, false)}</span>}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
